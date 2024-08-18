import { BadRequestException, Injectable } from '@nestjs/common';
import { TapEventDto } from './dto/tap-event.dto';
import { EnsureRequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Ambers, Points, TotalTapped } from 'src/assets/entities';

@Injectable()
export class EventService {
  constructor(private em: EntityManager) {}

  @EnsureRequestContext()
  async registerTap(
    {
      totalTapped,
      points,
      ambers,
    }: { points: Points; ambers: Ambers; totalTapped: TotalTapped },
    { amount: tapCount }: TapEventDto,
  ) {
    if (points.amount < tapCount) {
      throw new BadRequestException('Not enough points');
    }

    points.amount -= tapCount;
    ambers.amount += tapCount;
    totalTapped.amount += tapCount;
    await this.em.flush();
  }
}
