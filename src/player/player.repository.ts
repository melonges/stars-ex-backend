import { EntityRepository } from '@mikro-orm/postgresql';
import { Player } from './entities/player.entity';
export class PlayerRepository extends EntityRepository<Player> {
  saveNewPlayer(player: Player): Promise<void> {
    return this.em.persistAndFlush(player);
  }
}
