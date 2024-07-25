import { Injectable, Logger } from '@nestjs/common';
import { Asset, AssetName } from './entities/asset.entity';
import { AssetRepository } from './asset.repository';
import { Player } from 'src/player/entities/player.entity';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';

@Injectable()
export class AssetService {
  logger = new Logger(AssetService.name);
  constructor(
    private assetRepository: AssetRepository,
    private configService: ConfigService<Config>,
  ) {}

  actualize(player: Player) {
    const points = this.getAssetSync(player, AssetName.POINT);
    if (!points) {
      throw new Error(
        `Player ${player.id} doesn't have ${AssetName.POINT} asset`,
      );
    }

    const { amount: passivePoints, interval: passivePointsInterval } =
      this.configService.getOrThrow('passive_income.points', { infer: true });

    if (Date.now() - points.updatedAt.getTime() > passivePointsInterval) {
      points.amount = Math.min(
        this.configService.getOrThrow('limits.points', { infer: true }),
        points.amount + passivePoints,
      );
    }
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
      type,
    } = this.configService.getOrThrow('rewards.referral', { infer: true });

    return this.add(
      referrer,
      AssetName[type],
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
