import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { AssetName } from 'src/asset/entities/asset.entity';
import { BaseEntity } from 'src/common/base.entity';
import { Player } from 'src/player/entities/player.entity';
import { TasksRepository } from '../tasks.repository';
import { NativeEnumName } from 'src/database/tative-enum-name';

@Entity({ repository: () => TasksRepository })
export class Task extends BaseEntity {
  @Property()
  title: string;
  @Property()
  reward: number;
  @Enum({ items: () => AssetName, nativeEnumName: NativeEnumName.ASSET })
  currency: AssetName;
  @Enum({ items: () => TaskType, nativeEnumName: NativeEnumName.TASK_TYPE })
  type: TaskType;
  @Property({ type: 'jsonb' })
  /*
   * Meta of task in json
   */
  meta: string;
}

@Entity()
export class TaskStatus extends BaseEntity {
  @ManyToOne()
  player: Player;
  @ManyToOne()
  task: Task;
  @Enum({ items: () => TaskStatusEnum, nativeEnumName: NativeEnumName.STATUS })
  status: TaskStatusEnum;
}

export enum TaskStatusEnum {
  FULFILLED = 'fulfilled',
  CLAIMED = 'claimed',
}

export enum TaskType {
  WELCOME = 'welcome',
  INVITE = 'invite',
  SUBSCRIBE = 'subscribe',
}
