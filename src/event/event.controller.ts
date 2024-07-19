import { Controller, Body, Patch } from '@nestjs/common';
import { EventService } from './event.service';
import { TapEventDto } from './dto/tap-event.dto';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Patch('tap')
  tap(@PlayerId() playerId: number, @Body() tapEventDto: TapEventDto) {
    return this.eventService.registerTap(playerId, tapEventDto);
  }
}
