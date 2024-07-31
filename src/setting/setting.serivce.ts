import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';
import { SettingDto } from './dto/setting.dto';

@Injectable()
export class SettingService {
  constructor(private readonly configService: ConfigService<Config>) {}

  getSetting(_: number): SettingDto {
    _;
    const price = this.configService.getOrThrow('price');
    const limits = this.configService.getOrThrow('limits');
    return { limits, price };
  }
}
