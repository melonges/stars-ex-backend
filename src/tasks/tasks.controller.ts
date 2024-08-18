import { Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { ApiPaginatedResponse } from 'src/common/swagger/ApiPaginatedResponse';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/common/swagger/pagination';
import { TaskStatusEnumDto } from './dto/task-status-enum.dto';
import { TaskDto } from './dto/task.dto';
import { TasksStatusRepository } from './tasks-status.repository';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { mapTaskStatusEnumToDto } from './tasks.utils';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlayerEntity } from 'src/common/decorators/player-entity.decorator';
import { Player } from 'src/player/entities/player.entity';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly tasksRepository: TasksRepository,
    private readonly tasksStatusRepository: TasksStatusRepository,
  ) {}

  @Get()
  @ApiPaginatedResponse(TaskDto)
  async findAll(
    @PlayerEntity() player: Player,
    @Query() options: PaginationDto,
  ): Promise<PaginatedResponse<TaskDto>> {
    const tasks = await this.tasksRepository.getTasks(options);
    await Promise.all(
      tasks.data.map((task) =>
        this.tasksService.checkTaskAndStart(player, task),
      ),
    );
    const taskStatuses = await Promise.all(
      tasks.data.map((task) =>
        this.tasksStatusRepository.getTaskStatus(player, task.id),
      ),
    );
    return {
      data: tasks.data.map((task, index) => ({
        title: task.title,
        status: taskStatuses[index]?.status
          ? mapTaskStatusEnumToDto(taskStatuses[index].status)
          : TaskStatusEnumDto.NOT_STARTED,
        rewardInAmbers: task.rewardInAmbers,
      })),
      meta: tasks.meta,
    };
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Patch('/claim/:id')
  claim(@PlayerId() playerId: number, @Param('id') taskId: number) {
    return this.tasksService.claimTask(playerId, taskId);
  }
}
