import { ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { TaskType } from '../entities/task.entity';
import { TaskStatusEnumDto } from './task-status-enum.dto';

export class SocialSubscriptionMetaTaskDto {
  url: string;
}

export class TaskDto {
  id: string;
  title: string;
  icon: string;
  type: TaskType;
  rewardInAmbers: number;
  status: TaskStatusEnumDto;
  @ApiPropertyOptional({
    oneOf: [
      {
        $ref: getSchemaPath(SocialSubscriptionMetaTaskDto),
        description: `Metadata for ${TaskType.SOCIAL_SUBSCRIPTION} task type`,
      },
    ],
    description: `Each task type has its own metadata`,
  })
  meta?: SocialSubscriptionMetaTaskDto;
}
