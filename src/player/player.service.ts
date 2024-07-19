import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { PlayerRepository } from './player.repository';
import { AssetService } from 'src/asset/asset.service';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepository: PlayerRepository,
    private assetService: AssetService,
  ) {}
  async create(createPlayerDto: CreatePlayerDto) {
    const player = new Player(createPlayerDto.id);
    await this.playerRepository.registerPlayer(player);
    await this.assetService.registerAsset(player);
    return player;
  }

  getPlayer(id: number): Promise<Player | null> {
    return this.playerRepository.getPlayer(id);
  }

  async isExists(id: number): Promise<boolean> {
    return await this.playerRepository.isExists(id);
  }

  getPlayerByRefId(refId: number): Promise<Player> {
    // refId is the same as player.id
    return this.playerRepository.getPlayerUnsafe(refId);
  }
}
