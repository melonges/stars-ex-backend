import { Controller, Get, Post } from '@nestjs/common';
import { AssetService } from './asset.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { PlayerAssetsDto } from './dto/player-assets.dto';
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
      { populate: ['energy', 'points', 'totalTapped'] },
    );
    this.assetService.actualize(player);
    const { ambers, totalTapped, points, energy } = player;
    // TODO: rename totalTaps to totalTapped
    // rename ar to ambers
    return {
      points: points.amount,
      energy: energy.amount,
      ar: ambers.amount,
      totalTaps: totalTapped.amount,
    };
  }

  // @Post('charge-points')
  // @ApiBadRequestResponse({ description: 'Not enough energy' })
  // chargePoints(@PlayerId() id: number) {
  //   this.assetService.chargePoints(id);
  // }
  //
  // @Get('time-to-full-energy')
  // getTimeToFullEnergy(@PlayerId() id: number): Promise<RemainingTimeDto> {
  //   return this.assetService.getTimeToFullEnergy(id);
  // }
}
