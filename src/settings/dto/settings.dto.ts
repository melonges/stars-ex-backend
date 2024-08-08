export class SettingsDto {
  playerLimits: {
    points: number;
    energy: number;
    referrals: number;
  };
  fullChargePointsCostInEnergy: number;
  referralRewards: {
    premium: number;
    normal: number;
  };
}
