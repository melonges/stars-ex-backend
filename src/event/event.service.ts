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
    private configService: ConfigService<Config>,
    private playerRepository: PlayerRepository,
    private em: EntityManager,
  ) {}

  @EnsureRequestContext()
  async registerTap(playerId: number, tapEventDto: TapEventDto) {
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

    const { points: pointsPriceInTap, ar: arPriceInTap } =
      this.configService.getOrThrow('price.tap', { infer: true });
    const tapAmountInPoints = tapEventDto.amount * pointsPriceInTap.amount;

    if (points.amount < tapAmountInPoints) {
      throw new BadRequestException('Not enough points');
    }

    points.amount -= tapAmountInPoints;
    ambers.amount += tapEventDto.amount * arPriceInTap.amount;
    totalTapped.amount += tapEventDto.amount;
    this.assetService.actualize(player);
    await this.em.flush();
  }
}
