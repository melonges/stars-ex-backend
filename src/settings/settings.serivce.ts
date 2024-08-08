import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';
import { SettingsDto } from './dto/settings.dto';
import { AssetsService } from 'src/assets/assets.service';
import { AssetsRepository } from 'src/assets/assets.repository';

@Injectable()
export class SettingsService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly assetsRepository: AssetsRepository,
    private readonly assetsService: AssetsService,
  ) {}

  async getSettings(playerId: number): Promise<SettingsDto> {
    const energy = await this.assetsRepository.getEnergy(playerId);
    const fullChargePointsCostInEnergy = this.assetsService.getChargePrice(
      energy!,
    );
    const playerLimits = this.configService.getOrThrow('player_limits', {
      infer: true,
    });
    const referralRewards = this.configService.getOrThrow('referral_rewards', {
      infer: true,
    });
    return { playerLimits, referralRewards, fullChargePointsCostInEnergy };
  }
}
