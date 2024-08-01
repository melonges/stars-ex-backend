import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Asset } from './entities/asset.entity';
import { AssetRepository } from './asset.repository';
import { Player } from 'src/player/entities/player.entity';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
    MikroOrmModule.forFeature([Asset, Player]),
  ],
  controllers: [AssetController],
  providers: [AssetService, AssetRepository],
  exports: [AssetService],
})
export class AssetModule {}
