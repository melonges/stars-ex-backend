import { Controller, Get } from '@nestjs/common';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { SettingService } from './setting.serivce';
import { SettingDto } from './dto/setting.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Setting')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  findOne(@PlayerId() id: number): SettingDto {
    return this.settingService.getSetting(id);
  }
}
