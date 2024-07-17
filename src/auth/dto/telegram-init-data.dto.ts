import { IsNotEmpty } from 'class-validator';

export class TelegramInitDataDto {
  @IsNotEmpty()
  string: string;
}
