import { Controller, Get } from '@nestjs/common';
import { AssetService } from './asset.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { PlayerAssetsDto } from './dto/player-assets.dto';
import { AssetName } from './entities/asset.entity';

@ApiBearerAuth()
@ApiTags('Asset')
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  async getPlayerAssets(@PlayerId() id: number): Promise<PlayerAssetsDto> {
    const assets = await this.assetService.getAssets(id);
    return {
      points: assets
        .filter((asset) => asset.name === AssetName.POINT)
        .reduce((sum, asset) => sum + asset.amount, 0),
      energy: assets
        .filter((asset) => asset.name === AssetName.ENERGY)
        .reduce((sum, asset) => sum + asset.amount, 0),
      ar: assets
        .filter((asset) => asset.name === AssetName.AR)
        .reduce((sum, asset) => sum + asset.amount, 0),
    };
  }
}
