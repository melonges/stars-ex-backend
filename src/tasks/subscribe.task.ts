import { TaskType } from './entities/task.entity';
import { TaskValidator } from './task.interface';

export class SubscribeTaskValidator implements TaskValidator {
  type = TaskType.SOCIAL_SUBSCRIPTION as const;
  async validateTask(): Promise<boolean> {
    return true;
  }
}
