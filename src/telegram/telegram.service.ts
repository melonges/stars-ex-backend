import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, CommandContext, Context } from 'grammy';
import { TelegramConfig } from './telegram.types';
import { PlayerService } from 'src/player/player.service';
import { ReferralService } from 'src/referral/referral.service';
import { getReferralIdFromMatch } from './telegram.helpers';
import { EnsureRequestContext, EntityManager } from '@mikro-orm/postgresql';
import { AssetService } from 'src/asset/asset.service';

@Injectable()
export class TelegramService implements OnApplicationBootstrap {
  private bot: Bot;
  private readonly logger = new Logger(TelegramService.name);
  constructor(
    private configService: ConfigService<TelegramConfig>,
    private playerService: PlayerService,
    @Inject(forwardRef(() => ReferralService))
    private referralService: ReferralService,
    private assetService: AssetService,
    private em: EntityManager,
  ) {
    this.bot = new Bot(this.configService.getOrThrow('TELEGRAM_TOKEN'));
  }
  onApplicationBootstrap() {
    this.bot.command('start', this.start.bind(this));
    // TODO: remove
    this.bot.command('dev', (ctx) =>
      ctx.reply('app', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                web_app: {
                  url: this.configService.getOrThrow('DEV_WEB_APP_URL'),
                },
                text: 'ambeaver',
              },
            ],
          ],
        },
      }),
    );
    this.bot.start();
  }

  getBotUserName(): string {
    if (!this.bot.isInited()) {
      throw new Error('Bot is not inited');
    }
    return this.bot.botInfo.username;
  }

  private welcome(ctx: CommandContext<Context>) {
    return ctx.reply('Welcome to Ambeaver', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              web_app: {
                url: this.configService.getOrThrow('WEB_APP_URL'),
              },
              text: 'ambeaver app',
            },
          ],
        ],
      },
    });
  }

  @EnsureRequestContext()
  private async start(ctx: CommandContext<Context>) {
    const fromId = ctx.from!.id;
    const { ref: refId } = getReferralIdFromMatch(ctx.match);
    if (await this.playerService.isExists(fromId)) {
      return await this.welcome(ctx);
    }
    //TODO: check on bot
    const newPlayer = this.playerService.create({
      id: fromId,
      username: ctx.from?.username,
    });
    if (refId && !isNaN(Number(refId))) {
      const referrer = await this.playerService.getPlayerByRefId(Number(refId));
      if (referrer) {
        const isPremiumNewPlayer = Boolean(ctx.from?.is_premium);
        this.referralService.addNewReferral(referrer, newPlayer);
        this.assetService.giveReferralReward(referrer, isPremiumNewPlayer);
      }
    }
    await this.em.persistAndFlush(newPlayer);
    this.logger.log(`New player ${fromId} registered`);
    await this.welcome(ctx);
  }
}
