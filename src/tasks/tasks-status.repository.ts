import { EntityRepository } from '@mikro-orm/core';
import { TaskStatus } from './entities/task.entity';

export class TasksStatusRepository extends EntityRepository<TaskStatus> {
  getTaskStatus(playerId: number, taskId: number) {
    return this.findOne({ player: playerId, task: taskId });
  }
}
