import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { TapEventDto } from './dto/tap-event.dto';
import { AssetService } from 'src/asset/asset.service';
import { EnsureRequestContext } from '@mikro-orm/core';
import { Config } from 'config/types.config';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/postgresql';
import { PlayerRepository } from 'src/player/player.repository';

@Injectable()
export class EventService {
  constructor(
    private assetService: AssetService,
    private playerRepository: PlayerRepository,
    private em: EntityManager,
  ) {}

  @EnsureRequestContext()
  async registerTap(playerId: number, { amount: tapCount }: TapEventDto) {
    const player = await this.playerRepository.findOne(
      { id: playerId },
      { populate: ['points', 'ambers', 'totalTapped', 'energy'] },
    );

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
    this.assetService.actualize(player);
    await this.em.flush();
  }
}
