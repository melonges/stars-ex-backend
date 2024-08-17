import { Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlayerId } from 'src/common/decorators/player-id.decorator';
import { ApiPaginatedResponse } from 'src/common/swagger/ApiPaginatedResponse';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/common/swagger/pagination';
import { TaskStatusEnumDto } from './dto/task-status-enum.dto';
import { TaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';
import { TasksStatusRepository } from './tasks-status.repository';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { mapTaskStatusEnumToDto } from './tasks.utils';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly tasksRepository: TasksRepository,
    private readonly tasksStatusRepository: TasksStatusRepository,
  ) {}

  @Get()
  @ApiPaginatedResponse(Task)
  async findAll(
    @PlayerId() playerId: number,
    @Query() options: PaginationDto,
  ): Promise<PaginatedResponse<TaskDto>> {
    const tasks = await this.tasksRepository.getTasks(options);
    const taskStatuses = await Promise.all(
      tasks.data.map((task) =>
        this.tasksStatusRepository.getTaskStatus(playerId, task.id),
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
  @Post('/start/:id')
  start(@PlayerId() playerId: number, @Param('id') taskId: number) {
    return this.tasksService.startTask(playerId, taskId);
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Patch('/claim/:id')
  claim(@PlayerId() playerId: number, @Param('id') taskId: number) {
    return this.tasksService.claimTask(playerId, taskId);
  }
}
