import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Asset, AssetName } from './entities/asset.entity';
import { AssetRepository } from './asset.repository';
import { Player } from 'src/player/entities/player.entity';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';
import { EntityManager } from '@mikro-orm/core';
import { RemainingTimeDto } from './dto/remaining-time.dto';

@Injectable()
export class AssetService {
  logger = new Logger(AssetService.name);
  constructor(
    private assetRepository: AssetRepository,
    private configService: ConfigService<Config>,
    private em: EntityManager,
  ) {}

  actualize(player: Player) {
    const points = this.getAssetSync(player, AssetName.POINT);
    const energy = this.getAssetSync(player, AssetName.ENERGY);
    if (!points || !energy) {
      throw new Error(`Player ${player.id} doesn't have needed asset`);
    }

    const {
      points: { amount: passivePoints, interval: passivePointsInterval },
      energy: { amount: passiveEnergy, interval: passiveEnergyInterval },
    } = this.configService.getOrThrow('passive_income', { infer: true });

    if (Date.now() - points.updatedAt.getTime() > passivePointsInterval) {
      points.amount = Math.min(
        this.configService.getOrThrow('limits.points', { infer: true }),
        points.amount + passivePoints,
      );
    }

    if (Date.now() - energy.updatedAt.getTime() > passiveEnergyInterval) {
      energy.amount = Math.min(
        this.configService.getOrThrow('limits.energy', { infer: true }),
        energy.amount + passiveEnergy,
      );
    }
  }

  async getTimeToFullEnergy(playerId: number): Promise<RemainingTimeDto> {
    const assets = await this.assetRepository.getAssetsByPlayerId(playerId);
    const energy = assets.find((asset) => asset.name === AssetName.ENERGY);
    if (!energy) {
      throw new Error(`Player ${playerId} doesn't have needed asset`);
    }
    if (
      energy.amount ==
      this.configService.getOrThrow('limits.energy', {
        infer: true,
      })
    ) {
      return { remainingTime: 0 };
    }

    const elapsedTime = Date.now() - energy.updatedAt.getTime();

    return {
      remainingTime: elapsedTime,
    };
  }

  async chargePoints(playerId: number) {
    const asset = await this.assetRepository.getAssetsByPlayerId(playerId);
    const points = asset.find((asset) => asset.name === AssetName.POINT);
    const energy = asset.find((asset) => asset.name === AssetName.ENERGY);
    if (!points || !energy) {
      throw new Error(`Player ${playerId} doesn't have needed asset`);
    }

    if (
      energy.amount <
      this.configService.getOrThrow('price.recovery.points.amount', {
        infer: true,
      })
    ) {
      throw new BadRequestException('Not enough energy');
    }
    points.amount = this.configService.getOrThrow('initial_state.points', {
      infer: true,
    });

    energy.amount -= this.configService.getOrThrow(
      'price.recovery.points.amount',
      {
        infer: true,
      },
    );
    await this.em.flush();
  }

  getAssetSync(player: Player, name: AssetName) {
    return player.assets.find((asset) => asset.name === name);
  }

  add(player: Player, name: AssetName, amount: number) {
    const asset = player.assets.find((asset) => asset.name === name);
    if (asset) {
      asset.amount += amount;
    } else {
      throw new Error(`Player ${player.id} doesn't have ${name} asset`);
    }
  }

  take(player: Player, name: AssetName, amount: number) {
    const asset = player.assets.find((asset) => asset.name === name);
    if (asset) {
      asset.amount -= amount;
    } else {
      throw new Error(`Player ${player.id} doesn't have ${name} asset`);
    }
  }

  giveReferralReward(referrer: Player, isPremiumReferee: boolean) {
    const {
      normal: { amount: normalReward },
      premium: { amount: premiumReward },
    } = this.configService.getOrThrow('rewards.referral', { infer: true });

    return this.add(
      referrer,
      AssetName.AR,
      isPremiumReferee ? premiumReward : normalReward,
    );
  }

  getInitialAssets(player: Player) {
    return [
      new Asset(
        player,
        AssetName.POINT,
        this.configService.getOrThrow('initial_state.points', { infer: true }),
      ),

      new Asset(
        player,
        AssetName.ENERGY,
        this.configService.getOrThrow('initial_state.energy', { infer: true }),
      ),
      new Asset(
        player,
        AssetName.AR,
        this.configService.getOrThrow('initial_state.ar', { infer: true }),
      ),
    ];
  }

  getAsset(player: Player, name: AssetName) {
    return this.assetRepository.getAsset(player, name);
  }

  getAssets(player: Player): Promise<Asset[]>;
  getAssets(playerId: number): Promise<Asset[]>;
  getAssets(arg: Player | number): Promise<Asset | Asset[]> {
    if (typeof arg === 'number') {
      return this.assetRepository.getAssetsByPlayerId(arg);
    } else {
      return this.assetRepository.getAssetsByPlayer(arg);
    }
  }
}
