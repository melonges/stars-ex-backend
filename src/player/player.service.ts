import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { AssetService } from 'src/asset/asset.service';
import { EntityManager, FindOneOptions } from '@mikro-orm/postgresql';
import { ParsedTelegramInitData } from 'src/auth/auth.types';

@Injectable()
export class PlayerService {
  constructor(
    private assetService: AssetService,
    private em: EntityManager,
  ) {}
  create(createPlayerDto: CreatePlayerDto) {
    const player = new Player(createPlayerDto.id, createPlayerDto.username);
    this.assetService
      .getInitialAssets(player)
      .forEach((asset) => player.assets.add(asset));
    this.em.persist(player);
    return player;
  }

  actualize(player: Player, tgInitData?: ParsedTelegramInitData) {
    this.assetService.actualize(player);
    if (tgInitData) {
      player.username = tgInitData.user.username;
    }
  }

  getPlayer(
    id: number,
    options?: FindOneOptions<Player, 'ZOV'>,
  ): Promise<Player | null> {
    return this.em.getRepository(Player).findOne({ id }, options);
  }

  getPlayerUnsafe(id: number): Promise<Player> {
    return this.em.getRepository(Player).findOneOrFail(id);
  }

  async isExists(id: number): Promise<boolean> {
    return this.em.getRepository(Player).isExists({ id });
  }

  getPlayerByRefId(refId: number): Promise<Player | null> {
    return this.getPlayer(refId, { populate: ['assets'] });
  }
}
