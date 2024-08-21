import { EntityRepository } from '@mikro-orm/core';
import { TaskStatus } from './entities/task.entity';
import { Player } from 'src/player/entities/player.entity';

export class TasksStatusRepository extends EntityRepository<TaskStatus> {
  getTaskStatus(player: Player, taskId: number) {
    return this.findOne({ player, task: taskId });
  }

  async isTaskStatusExists(player: Player, taskId: number) {
    return (await this.count({ player, task: taskId })) > 0;
  }
}
