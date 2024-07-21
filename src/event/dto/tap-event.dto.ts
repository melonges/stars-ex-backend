import { IsPositive } from 'class-validator';

export class TapEventDto {
  @IsPositive()
  amount: number;
}
