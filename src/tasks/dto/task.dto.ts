import { TaskType } from '../entities/task.entity';
import { TaskStatusEnumDto } from './task-status-enum.dto';

export class TaskDto {
  title: string;
  type: TaskType;
  rewardInAmbers: number;
  status: TaskStatusEnumDto;
}
