import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { EntityManager, FindOneOptions } from '@mikro-orm/postgresql';
import { ParsedTelegramInitData } from 'src/auth/auth.types';
import { AssetsService } from 'src/assets/assets.service';

@Injectable()
export class PlayerService {
  constructor(
    private assetsService: AssetsService,
    private em: EntityManager,
  ) {}
  create({ id, username }: CreatePlayerDto) {
    const { totalTapped, energy, ambers, points } =
      this.assetsService.getInitialPlayerAssetsValue();
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

  async actualizePlayerData(
    player: Player,
    tgInitData?: ParsedTelegramInitData,
  ) {
    if (tgInitData && tgInitData.user.username != player.username) {
      player.username = tgInitData.user.username;
      await this.em.flush();
    }
  }

  async getPlayerWithActualizedAssets(id: number): Promise<Player | null> {
    const player = await this.getPlayer(id, {
      populate: ['energy', 'points', 'ambers', 'totalTapped'],
    });
    if (!player) return null;
    this.assetsService.actualizePlayerAssets(player);
    return player;
  }

  getPlayer(
    id: number,
    options: FindOneOptions<Player, 'ZOV'> = {
      populate: ['points', 'ambers', 'energy', 'totalTapped'],
    },
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
    if (isNaN(refId)) return Promise.resolve(null);
    return this.getPlayer(refId, { populate: ['ambers'] });
  }
}
