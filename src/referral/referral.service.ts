import { Injectable } from '@nestjs/common';
import { Referral } from './entites/referral.entity';
import { Player } from 'src/player/entities/player.entity';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class ReferralService {
  constructor(private telegramService: TelegramService) {}
  addNewReferral(referrer: Player, referee: Player) {
    const newReferral = new Referral(referrer, referee);
    referrer.referrals.add(newReferral);
  }

  getReferralLink(playerId: number) {
    return `https://t.me/${this.telegramService.getBotUserName()}?start=ref-${playerId}`;
  }
}
