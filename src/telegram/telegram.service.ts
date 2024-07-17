import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { TelegramConfig } from './telegram.types';
import { PlayerService } from 'src/player/player.service';
import { ReferralService } from 'src/referral/referral.service';

@Injectable()
export class TelegramService implements OnApplicationBootstrap {
  private bot: Bot;
  constructor(
    private configService: ConfigService<TelegramConfig>,
    private playerService: PlayerService,
    private referralService: ReferralService,
  ) {
    this.bot = new Bot(this.configService.getOrThrow('TELEGRAM_TOKEN'));
  }

  onApplicationBootstrap() {
    this.bot.command('start', (ctx) => this.start(ctx.from!.id, ctx.match));
    this.bot.start();
  }

  private async start(fromId: number, refId: string) {
    console.log(fromId, refId);
    const newPlayer = await this.playerService.create({ id: fromId });
    if (refId && !isNaN(Number(refId))) {
      const referrer = await this.playerService.getPlayerByRefId(Number(refId));
      if (referrer) {
        await this.referralService.addReferralRecord(referrer, newPlayer);
      }
    }
  }
}
