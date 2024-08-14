import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AssetsModule } from 'src/assets/assets.module';
import { PlayerModule } from 'src/player/player.module';

@Module({
  imports: [AssetsModule, PlayerModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
