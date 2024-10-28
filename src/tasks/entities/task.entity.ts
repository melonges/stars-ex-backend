import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/base.entity';
import { Player } from 'src/player/entities/player.entity';
import { TasksRepository } from '../tasks.repository';
import { NativeEnumName } from 'src/database/tative-enum-name';
import { TasksStatusRepository } from '../tasks-status.repository';

@Entity({ repository: () => TasksRepository })
export class Task extends BaseEntity {
  @Property()
  title: string;
  @Property()
  icon: string;
  @Property()
  rewardInAmbers: number;
  @Enum({ items: () => TaskType, nativeEnumName: NativeEnumName.TASK_TYPE })
  type: TaskType;
  @Property({ type: 'jsonb' })
  /*
   * Meta of task in json
   */
  meta: Record<string, unknown>;
}

@Entity({ repository: () => TasksStatusRepository })
export class TaskStatus extends BaseEntity {
  @ManyToOne()
  player: Player;
  @ManyToOne()
  task: Task;
  @Enum({ items: () => TaskStatusEnum, nativeEnumName: NativeEnumName.STATUS })
  status: TaskStatusEnum;
}

export enum TaskStatusEnum {
  FINISHED = 'FINISHED',
  READY_FOR_CLAIM = 'READY_FOR_CLAIM',
}

export enum TaskType {
  INVITE_FRIENDS = 'INVITE_FRIENDS',
  SOCIAL_SUBSCRIPTION = 'SOCIAL_SUBSCRIPTION',
}
