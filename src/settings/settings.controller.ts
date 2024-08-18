import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.serivce';
import { SettingsDto } from './dto/settings.dto';
import { PlayerEntity } from 'src/common/decorators/player-entity.decorator';
import { Player } from 'src/player/entities/player.entity';

@ApiBearerAuth()
@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findOne(@PlayerEntity() player: Player): Promise<SettingsDto> {
    return this.settingsService.getSettings(player);
  }
}
