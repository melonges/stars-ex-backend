import { EntityRepository } from '@mikro-orm/postgresql';
import { Referral } from './entites/referral.entity';
import { Player } from 'src/player/entities/player.entity';
import { ReferralDto } from './dto/referral.dto';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/common/swagger/pagination';
export class ReferralRepository extends EntityRepository<Referral> {
  addNewReferral(referrer: Player, referee: Player) {
    const newReferral = new Referral(referrer, referee);
    referrer.referrals.add(newReferral);
  }

  async getReferrals(
    playerId: number,
    options: PaginationDto,
  ): Promise<PaginatedResponse<ReferralDto>> {
    const [referrer, count] = await this.em.findAndCount(
      Referral,
      { referrer: { id: playerId } },
      {
        populate: ['referee.username', 'referee.ambers'],
        fields: ['referee'],
        limit: options.perPage,
        offset: options.page * options.perPage,
      },
    );
    return {
      data: referrer.map(({ referee }) => ({
        username: referee.username,
        // TODO: rename ar to ambers
        ar: referee.ambers.amount,
      })),
      meta: {
        page: options.page,
        perPage: options.perPage,
        totalPages: Math.ceil(count / options.perPage),
        totalItems: count,
      },
    };
  }
}
