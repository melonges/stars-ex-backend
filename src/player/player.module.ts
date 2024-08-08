import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Player } from './entities/player.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerRepository } from './player.repository';
import { AssetsModule } from 'src/assets/assets.module';

@Module({
  imports: [MikroOrmModule.forFeature([Player]), AssetsModule],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerRepository],
  exports: [PlayerService, PlayerRepository],
})
export class PlayerModule {}
