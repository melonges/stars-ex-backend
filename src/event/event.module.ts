import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Player } from 'src/player/entities/player.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AssetsModule } from 'src/assets/assets.module';

@Module({
  imports: [AssetsModule, MikroOrmModule.forFeature([Player])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
