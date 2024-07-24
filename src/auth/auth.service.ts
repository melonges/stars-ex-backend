import { BadRequestException, Injectable } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import { isValidTgInitData, parseTelegramInitData } from './auth.helpers';
import { ConfigService } from '@nestjs/config';
import { TelegramConfig } from 'src/telegram/telegram.types';
import { Player } from 'src/player/entities/player.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private playerService: PlayerService,
    private configService: ConfigService<TelegramConfig>,
    private jwtService: JwtService,
  ) {}

  async signIn(data: string): Promise<{ access_token: string }> {
    const player = await this.signInByTelegramInitData(data);
    const payload = { sub: player.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  private async signInByTelegramInitData(tgInitData: string): Promise<Player> {
    const isValid = await isValidTgInitData(
      tgInitData,
      this.configService.getOrThrow('TELEGRAM_TOKEN'),
    );
    const parsedTgInitData = parseTelegramInitData(tgInitData);
    if (!isValid) throw new BadRequestException("Telegram's hash is invalid");
    if (Date.now() / 1000 - Number(parsedTgInitData.auth_date) > 86400) {
      throw new BadRequestException("Telegram's hash is expired");
    }
    return this.playerService.getPlayerUnsafe(parsedTgInitData.user.id);
  }
}
