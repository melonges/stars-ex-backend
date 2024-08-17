import { TaskStatusEnumDto } from './dto/task-status-enum.dto';
import { TaskStatusEnum } from './entities/task.entity';

export const mapTaskStatusEnumToDto = (status: TaskStatusEnum) => {
  switch (status) {
    case TaskStatusEnum.FINISHED:
      return TaskStatusEnumDto.FINISHED;
    case TaskStatusEnum.READY_FOR_CLAIM:
      return TaskStatusEnumDto.READY_FOR_CLAIM;
    default:
      return TaskStatusEnumDto.NOT_STARTED;
  }
};
