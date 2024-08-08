import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';
import { SettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly configService: ConfigService<Config>) {}

  getSettings(_: number): SettingsDto {
    _;
    const price = this.configService.getOrThrow('price', { infer: true });
    const limits = this.configService.getOrThrow('limits', { infer: true });
    const { referral } = this.configService.getOrThrow('rewards', {
      infer: true,
    });
    return { limits, price, referralReward: referral };
  }
}
