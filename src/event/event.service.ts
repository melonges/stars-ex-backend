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

@Injectable()
export class EventService {
  constructor(
    private playerService: PlayerService,
    private assetService: AssetService,
  ) {}

  async registerTap(playerId: number, tapEventDto: TapEventDto) {
    const player = await this.playerService.getPlayer(playerId);
    if (!player) {
      throw new UnauthorizedException();
    }
    const [points] = await Promise.all([
      this.assetService.getAsset(player, AssetName.POINT),
    ]);
    if (!points) {
      throw new InternalServerErrorException();
    }

    if (points.amount < tapEventDto.amount) {
      throw new BadRequestException('Not enough points');
    }
    await this.assetService.setAssetAmount(
      player,
      AssetName.POINT,
      points.amount - tapEventDto.amount,
    );
  }
}
