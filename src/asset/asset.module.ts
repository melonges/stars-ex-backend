import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AssetRepository } from './asset.repository';
import { Player } from 'src/player/entities/player.entity';
import { TotalTapped } from './entities/total-tapped.entity';
import { Ambers } from './entities/ambers.entity';
import { Points } from './entities/points.entity';
import { Energy } from './entities/energy.entity';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
    MikroOrmModule.forFeature([Player, Energy, Points, Ambers, TotalTapped]),
  ],
  controllers: [AssetController],
  providers: [AssetService, AssetRepository],
  exports: [AssetService],
})
export class AssetModule {}
