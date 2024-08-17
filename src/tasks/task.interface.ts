import { Player } from 'src/player/entities/player.entity';
import { Task, TaskType } from './entities/task.entity';

export interface TaskValidator {
  type: TaskType;
  validateTask(player: Player, task: Task): Promise<boolean>;
}
