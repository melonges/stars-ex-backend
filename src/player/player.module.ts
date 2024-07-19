import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Player } from './entities/player.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerRepository } from './player.repository';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Player]),
    AssetModule,
    // ConfigModule.forFeature(configuration),
  ],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerRepository],
  exports: [PlayerService],
})
export class PlayerModule {}
