import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PlayerModule } from 'src/player/player.module';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  imports: [PlayerModule, AssetModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
