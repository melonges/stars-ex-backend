import { Controller, Get } from '@nestjs/common';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.serivce';
import { SettingsDto } from './dto/settings.dto';

@ApiBearerAuth()
@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findOne(@PlayerId() id: number): Promise<SettingsDto> {
    return this.settingsService.getSettings(id);
  }
}
