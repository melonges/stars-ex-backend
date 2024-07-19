import { IsNotEmpty } from 'class-validator';

export class TelegramInitDataDto {
  @IsNotEmpty()
  initData: string;
}
