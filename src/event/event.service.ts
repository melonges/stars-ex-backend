import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { TapEventDto } from './dto/tap-event.dto';
import { AssetService } from 'src/asset/asset.service';
import { AssetName } from 'src/asset/entities/asset.entity';
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
      { populate: ['assets'] },
    );

    if (!player) {
      throw new UnauthorizedException('player not found');
    }

    const points = player.assets.find(
      (asset) => asset.name === AssetName.POINT,
    );
    const ar = player.assets.find((asset) => asset.name === AssetName.AR);
    if (!points || !ar) {
      throw new InternalServerErrorException();
    }

    this.assetService.actualize(player);

    if (points.amount < tapEventDto.amount) {
      throw new BadRequestException('Not enough points');
    }

    const { points: pointsPrice, ar: arPrice } = this.configService.getOrThrow(
      'price.tap',
      { infer: true },
    );

    points.amount -= tapEventDto.amount * pointsPrice.amount;
    ar.amount += tapEventDto.amount * arPrice.amount;
    await this.em.flush();
  }
}
