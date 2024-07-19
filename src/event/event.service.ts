import { Injectable } from '@nestjs/common';
import { TapEventDto } from './dto/tap-event.dto';
import { PlayerService } from 'src/player/player.service';

@Injectable()
export class EventService {
  constructor(private playerService: PlayerService) {}

  async registerTap(playerId: number, tapEventDto: TapEventDto) {
    return tapEventDto;
  }
}
