import { Controller, Body, Patch } from '@nestjs/common';
import { EventService } from './event.service';
import { TapEventDto } from './dto/tap-event.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlayerEntity } from 'src/common/decorators/player-entity.decorator';
import { Player } from 'src/player/entities/player.entity';

@ApiBearerAuth()
@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Patch('tap')
  tap(@PlayerEntity() player: Player, @Body() tapEventDto: TapEventDto) {
    return this.eventService.registerTap(player, tapEventDto);
  }
}
