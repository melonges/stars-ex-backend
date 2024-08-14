import { BadRequestException, Injectable } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import { isValidTgInitData, parseTelegramInitData } from './auth.helpers';
import { ConfigService } from '@nestjs/config';
import { TelegramConfig } from 'src/telegram/telegram.types';
import { Player } from 'src/player/entities/player.entity';
import { JwtService } from '@nestjs/jwt';
import { ParsedTelegramInitData } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private playerService: PlayerService,
    private configService: ConfigService<TelegramConfig>,
    private jwtService: JwtService,
  ) {}

  async signIn(data: string): Promise<{ access_token: string }> {
    const [player, tgInitData] = await this.signInByTelegramInitData(data);
    if (!player) throw new BadRequestException('Telegram is not registered');
    await this.playerService.actualizePlayerData(player, tgInitData);
    const payload = { sub: player.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  private async signInByTelegramInitData(
    tgInitData: string,
  ): Promise<[player: Player | null, tgInitData: ParsedTelegramInitData]> {
    const isValid = await isValidTgInitData(
      tgInitData,
      this.configService.getOrThrow('TELEGRAM_TOKEN'),
    );
    if (!isValid) throw new BadRequestException("Telegram's hash is invalid");
    const parsedTgInitData = parseTelegramInitData(tgInitData);
    if (Date.now() / 1000 - Number(parsedTgInitData.auth_date) > 86400) {
      throw new BadRequestException("Telegram's hash is expired");
    }
    return [
      await this.playerService.getPlayer(parsedTgInitData.user.id, {
        populate: ['points', 'energy'],
      }),
      parsedTgInitData,
    ];
  }
}
