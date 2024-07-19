import { Controller } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
}
