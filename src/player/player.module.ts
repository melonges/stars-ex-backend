import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Player } from './entities/player.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Player])],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
