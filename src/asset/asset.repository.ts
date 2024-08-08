import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Player } from 'src/player/entities/player.entity';
import { Ambers, Energy, Points } from './entities';

@Injectable()
export class AssetRepository {
  constructor(
    @InjectRepository(Energy)
    private energyRepository: EntityRepository<Energy>,

    @InjectRepository(Points)
    private pointsRepository: EntityRepository<Points>,

    @InjectRepository(Ambers)
    private ambersRepository: EntityRepository<Ambers>,
    private em: EntityManager,
  ) {}

  getPoints<T extends number | Player>(player: T) {
    return this.pointsRepository.findOne({ player });
  }

  getEnergy<T extends number | Player>(player: T) {
    return this.energyRepository.findOne({ player });
  }

  getAmbers<T extends number | Player>(player: T) {
    return this.ambersRepository.findOne({ player });
  }
}
