import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { TapEventDto } from './dto/tap-event.dto';
import { PlayerService } from 'src/player/player.service';
import { AssetService } from 'src/asset/asset.service';
import { AssetName } from 'src/asset/entities/asset.entity';
import { EnsureRequestContext } from '@mikro-orm/core';
import { Config } from 'config/types.config';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class EventService {
  constructor(
    private playerService: PlayerService,
    private assetService: AssetService,
    private configService: ConfigService<Config>,
    private em: EntityManager,
  ) {}

  @EnsureRequestContext()
  async registerTap(playerId: number, tapEventDto: TapEventDto) {
    const player = await this.playerService.getPlayer(playerId);
    if (!player) {
      throw new UnauthorizedException();
    }
    const [points, ar] = await Promise.all([
      this.assetService.getAsset(player, AssetName.POINT),
      this.assetService.getAsset(player, AssetName.AR),
    ]);
    if (!points || !ar) {
      throw new InternalServerErrorException();
    }

    this.assetService.actualize(player);

    if (points.amount < tapEventDto.amount) {
      throw new BadRequestException('Not enough points');
    }

    points.amount -= tapEventDto.amount;
    ar.amount += tapEventDto.amount;
    // this.assetService.add(player, AssetName.AR, tapEventDto.amount);
    // this.assetService.take(player, AssetName.POINT, tapEventDto.amount);
    await this.em.flush();
  }
}
