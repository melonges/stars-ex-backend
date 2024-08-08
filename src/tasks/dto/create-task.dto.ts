import { AssetName } from 'src/asset/entities/asset.entity';
export class CreateTaskDto {
  title: string;
  reward: number;
  currency: AssetName;
}
