import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PlayerModule } from 'src/player/player.module';

@Module({
  imports: [PlayerModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
