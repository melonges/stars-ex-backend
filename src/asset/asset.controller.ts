import { Controller, Get, Post } from '@nestjs/common';
import { AssetService } from './asset.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { PlayerAssetsDto } from './dto/player-assets.dto';
import { AssetName } from './entities/asset.entity';
import { RemainingTimeDto } from './dto/remaining-time.dto';
import { PlayerRepository } from 'src/player/player.repository';

@ApiBearerAuth()
@ApiTags('Asset')
@Controller('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private playerRepository: PlayerRepository,
  ) {}

  @Get()
  async getPlayerAssets(@PlayerId() id: number): Promise<PlayerAssetsDto> {
    const player = await this.playerRepository.findOneOrFail(
      { id },
      { populate: ['assets'] },
    );
    this.assetService.actualize(player);
    const assets = await this.assetService.getAssets(player);
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
      totalTaps: assets
        .filter((asset) => asset.name === AssetName.TOTAL_TAPED)
        .reduce((sum, asset) => sum + asset.amount, 0),
    };
  }

  @Post('charge-points')
  @ApiBadRequestResponse({ description: 'Not enough energy' })
  chargePoints(@PlayerId() id: number) {
    this.assetService.chargePoints(id);
  }

  @Get('time-to-full-energy')
  getTimeToFullEnergy(@PlayerId() id: number): Promise<RemainingTimeDto> {
    return this.assetService.getTimeToFullEnergy(id);
  }
}
