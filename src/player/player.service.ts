import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}
  async create(createPlayerDto: CreatePlayerDto) {
    const player = new Player(createPlayerDto.id);
    await this.playerRepository.saveNewPlayer(player);
    return player;
  }

  findOne(id: number): Promise<Player> {
    return this.playerRepository.findOneOrFail({ id });
  }

  async isExists(id: number): Promise<boolean> {
    return (await this.playerRepository.count({ id })) > 0;
  }

  getPlayerByRefId(refId: number): Promise<Player | null> {
    // refId is the same as player.id
    return this.playerRepository.findOne({ id: refId });
  }
}
