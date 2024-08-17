import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { TaskStatusEnum, TaskType } from './entities/task.entity';
import { TaskValidator } from './task.interface';
import { InviteTaskValidator } from './invite.task';
import { SubscribeTaskValidator } from './subscribe.task';
import { EntityManager } from '@mikro-orm/core';
import { AssetsService } from 'src/assets/assets.service';
import { PlayerRepository } from 'src/player/player.repository';
import { TasksStatusRepository } from './tasks-status.repository';

@Injectable()
export class TasksService {
  constructor(
    private tasksRepository: TasksRepository,
    private assetService: AssetsService,
    private tasksStatusRepository: TasksStatusRepository,
    private playerRepository: PlayerRepository,
    private em: EntityManager,
  ) {}

  async startTask(playerId: number, taskId: number) {
    const taskStatus = await this.tasksStatusRepository.getTaskStatus(
      playerId,
      taskId,
    );

    // if task exists it means that task already READY_FOR_CLAIM or FINISHED
    if (taskStatus) {
      throw new BadRequestException(`$Task is already ${taskStatus.status}`);
    }

    const [player, task] = await Promise.all([
      this.playerRepository.findOne(playerId),
      await this.tasksRepository.findOne(taskId),
    ]);
    if (!task) {
      throw new NotFoundException();
    }
    if (!player) {
      throw new UnauthorizedException();
    }

    const taskValidator = this.taskTypeToTaskValidator(task.type);
    const isCompletedTask = await taskValidator.validateTask(player, task);
    if (!isCompletedTask) {
      throw new BadRequestException();
    }

    try {
      await this.em.begin();
      const newTaskStatus = this.tasksStatusRepository.create({
        player,
        task,
        status: TaskStatusEnum.READY_FOR_CLAIM,
      });
      this.em.persist(newTaskStatus);
      await this.em.commit();
    } catch (error) {
      await this.em.rollback();
      throw error;
    }
  }

  async claimTask(playerId: number, taskId: number) {
    const taskStatus = await this.tasksStatusRepository.findOne(
      {
        id: taskId,
        player: playerId,
      },
      { populate: ['player', 'player.ambers', 'task'] },
    );

    if (!taskStatus) {
      throw new NotFoundException();
    }
    if (taskStatus.status !== TaskStatusEnum.READY_FOR_CLAIM) {
      throw new BadRequestException('Task is not ready to claim');
    }

    try {
      await this.em.begin();
      this.assetService.giveTaskReward(taskStatus.player, taskStatus.task);
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
}
