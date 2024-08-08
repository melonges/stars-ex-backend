import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';
import { SettingsDto } from './dto/settings.dto';
import { AssetRepository } from 'src/asset/asset.repository';
import { AssetService } from 'src/asset/asset.service';

@Injectable()
export class SettingsService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly assetRepository: AssetRepository,
    private readonly assetService: AssetService,
  ) {}

  async getSettings(playerId: number): Promise<SettingsDto> {
    const energy = await this.assetRepository.getEnergy(playerId);
    const fullChargePointsCostInEnergy = this.assetService.getChargePrice(
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
