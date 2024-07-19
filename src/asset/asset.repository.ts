import { Injectable } from '@nestjs/common';
import { Asset, AssetName } from './entities/asset.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Player } from 'src/player/entities/player.entity';

@Injectable()
export class AssetRepository {
  constructor(
    @InjectRepository(Asset)
    private _assetRepository: EntityRepository<Asset>,
    private em: EntityManager,
  ) {}

  updateAsset(asset: Asset) {
    return this.em.fork().persistAndFlush(asset);
  }

  registerAsset(asset: Asset) {
    return this._assetRepository.insert(asset);
  }

  getAssetsByPlayer(player: Player) {
    return this._assetRepository.find({ player });
  }

  getAssetsByPlayerId(playerId: number) {
    return this._assetRepository.find({ player: { id: playerId } });
  }

  getAsset(player: Player, name: AssetName) {
    return this._assetRepository.findOne({ player, name });
  }
}
