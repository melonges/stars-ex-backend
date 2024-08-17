import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Player } from 'src/player/entities/player.entity';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';
import { EntityManager } from '@mikro-orm/core';
import { RemainingTimeDto } from './dto/remaining-time.dto';
import { Energy } from './entities/energy.entity';
import { AssetsRepository } from './assets.repository';
import { Task } from 'src/tasks/entities/task.entity';

@Injectable()
export class AssetsService {
  logger = new Logger(AssetsService.name);
  constructor(
    private assetRepository: AssetsRepository,
    private configService: ConfigService<Config>,
    private em: EntityManager,
  ) {}

  actualizePlayerAssets({
    energy,
    points,
    id,
  }: Pick<Player, 'energy' | 'points' | 'id'>) {
    if (!points || !energy) {
      throw new Error(`Player ${id} doesn't have needed asset`);
    }

    const { points: pointsLimit, energy: energyLimit } =
      this.configService.getOrThrow('player_limits', {
        infer: true,
      });
    const { points: pointsRecoveryTime, energy: energyRecoveryTime } =
      this.configService.getOrThrow('full_recovery_time', {
        infer: true,
      });

    if (Date.now() - points.updatedAt.getTime() > pointsRecoveryTime) {
      points.amount = pointsLimit;
    }

    if (Date.now() - energy.updatedAt.getTime() > energyRecoveryTime) {
      energy.amount = energyLimit;
    }
  }

  async getTimeToFullEnergy(playerId: number): Promise<RemainingTimeDto> {
    const energy = await this.assetRepository.getEnergy(playerId);
    if (!energy) {
      throw new Error(`Player ${playerId} doesn't have needed asset`);
    }

    if (
      energy.amount ==
      this.configService.getOrThrow('player_limits.energy', {
        infer: true,
      })
    ) {
      return { remainingTime: 0 };
    }

    const elapsedTime =
      energy.firstChargeInDay.getTime() +
      this.configService.getOrThrow('full_recovery_time.energy', {
        infer: true,
      }) -
      Date.now();

    return {
      remainingTime: elapsedTime < 0 ? 0 : elapsedTime,
    };
  }

  async chargePoints(playerId: number) {
    const [points, energy] = await Promise.all([
      this.assetRepository.getPoints(playerId),
      this.assetRepository.getEnergy(playerId),
    ]);
    if (!points || !energy) {
      throw new Error(`Player ${playerId} doesn't have needed asset`);
    }

    const chargePrice = this.getChargePrice(energy);

    if (energy.amount < chargePrice) {
      throw new BadRequestException('Not enough energy');
    }
    points.amount = this.configService.getOrThrow('player_limits.points', {
      infer: true,
    });

    if (energy.isNewDay()) {
      energy.firstChargeInDay = new Date();
      energy.chargesInDay = 1;
    } else {
      energy.chargesInDay++;
    }

    energy.amount -= chargePrice;
    await this.em.flush();
  }
  //
  giveReferralReward(referrer: Player, isPremiumReferee: boolean) {
    const { normal: normalReward, premium: premiumReward } =
      this.configService.getOrThrow('referral_rewards', { infer: true });
    referrer.ambers.amount += isPremiumReferee ? premiumReward : normalReward;
  }

  giveTaskReward(player: Player, task: Task): void {
    player.ambers.amount += task.rewardInAmbers;
  }

  getInitialPlayerAssetsValue() {
    const { points, energy, ambers } = this.configService.getOrThrow(
      'initial_player_assets',
      {
        infer: true,
      },
    );
    return {
      energy,
      points,
      ambers,
      totalTapped: 0,
    };
  }

  getChargePrice(energy: Energy) {
    const fullChargePointsCost = this.configService.getOrThrow(
      'action_price.full_charge_points',
      { infer: true },
    );
    return (
      fullChargePointsCost * (energy.isNewDay() ? 1 : energy.chargesInDay * 2)
    );
  }
}
