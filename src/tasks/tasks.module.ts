import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AssetsModule } from 'src/assets/assets.module';
import { PlayerModule } from 'src/player/player.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task, TaskStatus } from './entities/task.entity';

@Module({
  imports: [
    AssetsModule,
    PlayerModule,
    MikroOrmModule.forFeature([Task, TaskStatus]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
