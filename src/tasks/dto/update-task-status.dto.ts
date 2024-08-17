export enum TaskAction {
  START = 'START',
  CLAIM = 'CLAIM',
}
export class UpdateTaskStatusDto {
  status: TaskAction;
}
