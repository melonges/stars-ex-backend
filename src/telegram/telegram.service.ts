import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, CommandContext, Context } from 'grammy';
import { TelegramConfig } from './telegram.types';
import { PlayerService } from 'src/player/player.service';
import { ReferralService } from 'src/referral/referral.service';
import { getReferralIdFromMatch } from './telegram.helpers';

@Injectable()
export class TelegramService implements OnApplicationBootstrap {
  private bot: Bot;
  private readonly logger = new Logger(TelegramService.name);
  constructor(
    private configService: ConfigService<TelegramConfig>,
    private playerService: PlayerService,
    private referralService: ReferralService,
  ) {
    this.bot = new Bot(this.configService.getOrThrow('TELEGRAM_TOKEN'));
  }

  onApplicationBootstrap() {
    this.bot.command('start', this.start.bind(this));
    this.bot.start();
  }

  private async start(ctx: CommandContext<Context>) {
    const fromId = ctx.from!.id;
    const { ref: refId } = getReferralIdFromMatch(ctx.match);
    if (await this.playerService.isExists(fromId)) {
      return;
    }
    const newPlayer = await this.playerService.create({ id: fromId });
    this.logger.log(`New player ${fromId} registered`);
    if (refId && !isNaN(Number(refId))) {
      const referrer = await this.playerService.getPlayerByRefId(Number(refId));
      if (referrer) {
        await this.referralService.addReferralRecord(referrer, newPlayer);
      }
    }
  }
}
