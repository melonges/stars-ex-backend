import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';
import { SettingsDto } from './dto/settings.dto';
import { AssetsService } from 'src/assets/assets.service';
import { Player } from 'src/player/entities/player.entity';

@Injectable()
export class SettingsService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly assetsService: AssetsService,
  ) {}

  async getSettings(player: Player): Promise<SettingsDto> {
    const fullChargePointsCostInEnergy = this.assetsService.getChargePrice(
      player.energy,
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
