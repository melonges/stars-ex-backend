import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AssetRepository } from './asset.repository';
import { Player } from 'src/player/entities/player.entity';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';
import { EntityManager } from '@mikro-orm/core';
import { RemainingTimeDto } from './dto/remaining-time.dto';
import { Energy } from './entities/energy.entity';
import { Points } from './entities/points.entity';
import { Ambers } from './entities/ambers.entity';
import { TotalTapped } from './entities/total-tapped.entity';

@Injectable()
export class AssetService {
  logger = new Logger(AssetService.name);
  constructor(
    private assetRepository: AssetRepository,
    private configService: ConfigService<Config>,
    private em: EntityManager,
  ) {}

  actualize({ energy, points, id }: Player) {
    if (!points || !energy) {
      throw new Error(`Player ${id} doesn't have needed asset`);
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

  // async getTimeToFullEnergy(playerId: number): Promise<RemainingTimeDto> {
  //   const assets = await this.assetRepository.getAssetsByPlayerId(playerId);
  //   if (!energy) {
  //     throw new Error(`Player ${playerId} doesn't have needed asset`);
  //   }
  //   if (
  //     energy.amount ==
  //     this.configService.getOrThrow('limits.energy', {
  //       infer: true,
  //     })
  //   ) {
  //     return { remainingTime: 0 };
  //   }
  //
  //   const elapsedTime = Date.now() - energy.updatedAt.getTime();
  //
  //   return {
  //     remainingTime: elapsedTime,
  //   };
  // }

  // async chargePoints(playerId: number) {
  //   const asset = await this.assetRepository.getAssetsByPlayerId(playerId);
  //   const points = asset.find((asset) => asset.name === AssetName.POINT);
  //   const energy = asset.find((asset) => asset.name === AssetName.ENERGY);
  //   if (!points || !energy) {
  //     throw new Error(`Player ${playerId} doesn't have needed asset`);
  //   }
  //
  //   if (
  //     energy.amount <
  //     this.configService.getOrThrow('price.recovery.points.amount', {
  //       infer: true,
  //     })
  //   ) {
  //     throw new BadRequestException('Not enough energy');
  //   }
  //   points.amount = this.configService.getOrThrow('initial_state.points', {
  //     infer: true,
  //   });
  //
  //   energy.amount -= this.configService.getOrThrow(
  //     'price.recovery.points.amount',
  //     {
  //       infer: true,
  //     },
  //   );
  //   await this.em.flush();
  // }
  //
  giveReferralReward(referrer: Player, isPremiumReferee: boolean) {
    const {
      normal: { amount: normalReward },
      premium: { amount: premiumReward },
    } = this.configService.getOrThrow('rewards.referral', { infer: true });

    referrer.ambers.amount += isPremiumReferee ? premiumReward : normalReward;
  }

  getInitialPlayerAssetsValue() {
    return {
      energy: this.configService.getOrThrow('initial_state.energy', {
        infer: true,
      }),
      points: this.configService.getOrThrow('initial_state.points', {
        infer: true,
      }),
      ambers: this.configService.getOrThrow('initial_state.ar', {
        infer: true,
      }),
      totalTapped: 0,
    };
  }
}
