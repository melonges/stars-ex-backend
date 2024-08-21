import { Player } from 'src/player/entities/player.entity';
import { Task, TaskType } from './entities/task.entity';
import { TaskValidator } from './task.interface';
import { TaskMetaParser } from './tasks.meta';

export class InviteTaskValidator implements TaskValidator {
  type = TaskType.INVITE_FRIENDS as const;
  async validateTask(player: Player, task: Task): Promise<boolean> {
    const { amount: neededAmountOfFriends } = TaskMetaParser[this.type].parse(
      task.meta,
    );

    if ((await player.referrals.loadCount()) >= neededAmountOfFriends) {
      return true;
    }
    return false;
  }
}
