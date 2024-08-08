import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AssetModule } from 'src/asset/asset.module';
import { Player } from 'src/player/entities/player.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [AssetModule, MikroOrmModule.forFeature([Player])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
