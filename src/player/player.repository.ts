import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Player } from './entities/player.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectRepository(Player)
    private _playerRepository: EntityRepository<Player>,
    private em: EntityManager,
  ) {}
  registerPlayer(player: Player): Promise<void> {
    return this.em.fork().persistAndFlush(player);
  }

  async isExists(id: number): Promise<boolean> {
    return (await this._playerRepository.count({ id })) > 0;
  }

  getPlayer(id: number): Promise<Player | null> {
    return this._playerRepository.findOne({ id });
  }

  getPlayerUnsafe(id: number): Promise<Player> {
    return this._playerRepository.findOneOrFail({ id });
  }
}
