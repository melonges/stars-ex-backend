import { Enum, ManyToOne, Property } from '@mikro-orm/core';
import { AssetName } from 'src/asset/entities/asset.entity';
import { BaseEntity } from 'src/common/base.entity';
import { Player } from 'src/player/entities/player.entity';

export class Task extends BaseEntity {
  @Property()
  title: string;
  @Property()
  reward: number;
  @Enum({ items: () => AssetName, nativeEnumName: 'asset_name' })
  currency: AssetName;
}

export class TaskStatus extends BaseEntity {
  @ManyToOne()
  player: Player;
  @ManyToOne()
  task: Task;
  @Enum({ items: () => TaskStatusEnum, nativeEnumName: 'task_status' })
  status: TaskStatusEnum;
}

export enum TaskStatusEnum {
  FULFILLED = 'fulfilled',
  CLAIMED = 'claimed',
}
