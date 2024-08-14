import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { TapEventDto } from './dto/tap-event.dto';
import { EnsureRequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { PlayerService } from 'src/player/player.service';

@Injectable()
export class EventService {
  constructor(
    private playerService: PlayerService,
    private em: EntityManager,
  ) {}

  @EnsureRequestContext()
  async registerTap(playerId: number, { amount: tapCount }: TapEventDto) {
    const player =
      await this.playerService.getPlayerWithActualizedAssets(playerId);
    if (!player) {
      throw new UnauthorizedException('player not found');
    }

    const { totalTapped, ambers, points } = player;

    if (!points || !ambers || !totalTapped) {
      throw new InternalServerErrorException();
    }

    if (points.amount < tapCount) {
      throw new BadRequestException('Not enough points');
    }

    points.amount -= tapCount;
    ambers.amount += tapCount;
    totalTapped.amount += tapCount;
    await this.em.flush();
  }
}
