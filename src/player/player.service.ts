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
  create({ id, username }: CreatePlayerDto) {
    const { totalTapped, energy, ambers, points } =
      this.assetService.getInitialPlayerAssetsValue();
    const player = this.em.create(Player, {
      id,
      username,
      totalTapped: { amount: totalTapped },
      points: { amount: points },
      energy: { amount: energy },
      ambers: { amount: ambers },
    });
    return player;
  }

  async actualize(player: Player, tgInitData?: ParsedTelegramInitData) {
    if (tgInitData && tgInitData.user.username != player.username) {
      player.username = tgInitData.user.username;
      await this.em.flush();
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
    return this.getPlayer(refId, { populate: ['ambers'] });
  }
}
