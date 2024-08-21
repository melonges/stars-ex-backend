import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, TaskStatusEnum, TaskType } from './entities/task.entity';
import { TaskValidator } from './task.interface';
import { InviteTaskValidator } from './invite.task';
import { SubscribeTaskValidator } from './subscribe.task';
import { EntityManager } from '@mikro-orm/core';
import { AssetsService } from 'src/assets/assets.service';
import { TasksStatusRepository } from './tasks-status.repository';
import { Player } from 'src/player/entities/player.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  private readonly supportsStart: ReadonlyArray<TaskType> = [
    TaskType.SOCIAL_SUBSCRIPTION,
  ];
  constructor(
    private assetService: AssetsService,
    private tasksStatusRepository: TasksStatusRepository,
    private tasksRepository: TasksRepository,
    private em: EntityManager,
  ) {}

  checkTasksOnComplitionAndUpdate(
    player: Player,
    tasks: Task[],
  ): Promise<void>[] {
    return tasks.map(async (task) => {
      if (this.supportsStart.includes(task.type)) return;

      const isTaskStatusExists =
        await this.tasksStatusRepository.isTaskStatusExists(player, task.id);

      // if task exists it means that task already READY_FOR_CLAIM or FINISHED
      if (isTaskStatusExists) return;
      const shouldClaim = await this.validateTask(player, task);
      if (!shouldClaim) return;
      return this.completeTask(player, task);
    });
  }

  async startTask(player: Player, taskId: number): Promise<void> {
    const task = await this.tasksRepository.findOne(taskId);
    if (!task) {
      throw new NotFoundException();
    }

    if (!this.supportsStart.includes(task.type)) {
      throw new BadRequestException(
        `Task type ${task.type} is not supports start`,
      );
    }
    const taskStatus = await this.tasksStatusRepository.getTaskStatus(
      player,
      taskId,
    );

    // if task exists it means that task already READY_FOR_CLAIM or FINISHED
    if (taskStatus) {
      throw new BadRequestException(`Task is already ${taskStatus.status} `);
    }

    const result = await this.validateTask(player, task);
    if (!result) {
      throw new BadRequestException('Task is not complete');
    }
    return this.completeTask(player, task);
  }

  async claimTask(player: Player, taskId: number) {
    const taskStatus = await this.tasksStatusRepository.findOne(
      {
        task: taskId,
        player,
      },
      { populate: ['task'] },
    );

    if (!taskStatus) {
      throw new NotFoundException();
    }
    if (taskStatus.status !== TaskStatusEnum.READY_FOR_CLAIM) {
      throw new BadRequestException('Task is not ready to claim');
    }

    try {
      await this.em.begin();
      this.assetService.giveTaskReward(player, taskStatus.task);
      taskStatus.status = TaskStatusEnum.FINISHED;
      await this.em.commit();
    } catch (error) {
      await this.em.rollback();
      throw error;
    }
  }

  private taskTypeToTaskValidator(taskType: TaskType): TaskValidator {
    switch (taskType) {
      case TaskType.INVITE_FRIENDS:
        return new InviteTaskValidator();
      case TaskType.SOCIAL_SUBSCRIPTION:
        return new SubscribeTaskValidator();
    }
  }

  private validateTask(player: Player, task: Task): Promise<boolean> {
    const taskValidator = this.taskTypeToTaskValidator(task.type);
    return taskValidator.validateTask(player, task);
  }

  private completeTask(player: Player, task: Task): Promise<void> {
    const newTaskStatus = this.tasksStatusRepository.create({
      player,
      task,
      status: TaskStatusEnum.READY_FOR_CLAIM,
    });
    return this.em.persistAndFlush(newTaskStatus);
  }
}
