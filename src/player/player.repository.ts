import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { Player } from './entities/player.entity';

export class PlayerRepository extends EntityRepository<Player> {
  async isExists(filter: FilterQuery<Player>): Promise<boolean> {
    return (await this.count(filter)) > 0;
  }
}
