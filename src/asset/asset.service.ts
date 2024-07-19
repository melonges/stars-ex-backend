import { Injectable } from '@nestjs/common';
import { Asset, AssetName } from './entities/asset.entity';
import { AssetRepository } from './asset.repository';
import { Player } from 'src/player/entities/player.entity';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/types.config';

@Injectable()
export class AssetService {
  constructor(
    private assetRepository: AssetRepository,
    private configService: ConfigService<Config>,
  ) {}
  setAssetAmount(player: Player, name: AssetName, amount: number) {
    const asset = new Asset(player, name, amount);
    return this.assetRepository.updateAsset(asset);
  }

  async registerAsset(player: Player) {
    const points = new Asset(
      player,
      AssetName.POINT,
      this.configService.getOrThrow('initial_state.points', { infer: true }),
    );

    const energy = new Asset(
      player,
      AssetName.ENERGY,
      this.configService.getOrThrow('initial_state.energy', { infer: true }),
    );

    const arToken = new Asset(
      player,
      AssetName.AR,
      this.configService.getOrThrow('initial_state.ar', { infer: true }),
    );

    [points, energy, arToken].forEach(
      async (asset) => await this.assetRepository.registerAsset(asset),
    );
  }

  getAsset(player: Player, name: AssetName) {
    return this.assetRepository.getAsset(player, name);
  }

  getAssets(player: Player): Promise<Asset[]>;
  getAssets(playerId: number): Promise<Asset[]>;
  getAssets(arg: Player | number): Promise<Asset | Asset[]> {
    if (typeof arg === 'number') {
      return this.assetRepository.getAssetsByPlayerId(arg);
    } else {
      return this.assetRepository.getAssetsByPlayer(arg);
    }
  }
}
