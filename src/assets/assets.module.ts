import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Player } from 'src/player/entities/player.entity';
import { TotalTapped } from './entities/total-tapped.entity';
import { Ambers } from './entities/ambers.entity';
import { Points } from './entities/points.entity';
import { Energy } from './entities/energy.entity';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { AssetsRepository } from './assets.repository';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
    MikroOrmModule.forFeature([Player, Energy, Points, Ambers, TotalTapped]),
  ],
  controllers: [AssetsController],
  providers: [AssetsService, AssetsRepository],
  exports: [AssetsService, AssetsRepository],
})
export class AssetsModule {}
