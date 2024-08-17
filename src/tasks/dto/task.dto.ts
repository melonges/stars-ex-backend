import { TaskStatusEnumDto } from './task-status-enum.dto';

export class TaskDto {
  title: string;
  rewardInAmbers: number;
  status: TaskStatusEnumDto;
}
