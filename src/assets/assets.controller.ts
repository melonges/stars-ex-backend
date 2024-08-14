import { Controller, Get, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { PlayerAssetsDto } from './dto/player-assets.dto';
import { RemainingTimeDto } from './dto/remaining-time.dto';
import { PlayerRepository } from 'src/player/player.repository';
import { AssetsService } from './assets.service';

@ApiBearerAuth()
@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService,
    private playerRepository: PlayerRepository,
  ) {}

  @Get()
  async getPlayerAssets(@PlayerId() id: number): Promise<PlayerAssetsDto> {
    const player = await this.playerRepository.findOneOrFail(
      { id },
      { populate: ['energy', 'points', 'ambers', 'totalTapped'] },
    );
    this.assetsService.actualizePlayerAssets(player);
    const { ambers, totalTapped, points, energy } = player;
    return {
      points: points.amount,
      energy: energy.amount,
      ambers: ambers.amount,
      totalTapped: totalTapped.amount,
    };
  }

  @Post('charge-points')
  @ApiBadRequestResponse({ description: 'Not enough energy' })
  chargePoints(@PlayerId() id: number) {
    this.assetsService.chargePoints(id);
  }

  @Get('time-to-full-energy')
  getTimeToFullEnergy(@PlayerId() id: number): Promise<RemainingTimeDto> {
    return this.assetsService.getTimeToFullEnergy(id);
  }
}
