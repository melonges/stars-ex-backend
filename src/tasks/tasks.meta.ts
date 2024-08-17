import { z } from 'zod';
import { TaskType } from './entities/task.entity';

const InviteTaskMeta = z.object({
  amount: z.number(),
});

const SubscribeTaskMeta = z.object({
  link: z.string(),
});

type InviteTaskMetaType = z.infer<typeof InviteTaskMeta>;

type SubscribeTaskMetaType = z.infer<typeof SubscribeTaskMeta>;

export type TaskMeta = {
  [TaskType.INVITE_FRIENDS]: InviteTaskMetaType;
  [TaskType.SOCIAL_SUBSCRIPTION]: SubscribeTaskMetaType;
};

export const TaskMetaParser = {
  [TaskType.INVITE_FRIENDS]: InviteTaskMeta,
  [TaskType.SOCIAL_SUBSCRIPTION]: SubscribeTaskMeta,
};
