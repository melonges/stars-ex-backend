import { Controller, Get, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlayerAssetsDto } from './dto/player-assets.dto';
import { RemainingTimeDto } from './dto/remaining-time.dto';
import { AssetsService } from './assets.service';
import { PlayerEntity } from 'src/common/decorators/player-entity.decorator';
import { Player } from 'src/player/entities/player.entity';

@ApiBearerAuth()
@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async getPlayerAssets(
    @PlayerEntity() player: Player,
  ): Promise<PlayerAssetsDto> {
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
  chargePoints(@PlayerEntity() player: Player) {
    this.assetsService.chargePoints(player);
  }

  @Get('time-to-full-energy')
  getTimeToFullEnergy(
    @PlayerEntity() player: Player,
  ): Promise<RemainingTimeDto> {
    return this.assetsService.getTimeToFullEnergy(player.energy);
  }
}
