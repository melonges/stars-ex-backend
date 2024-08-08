export class SettingsDto {
  limits: {
    points: number;
    energy: number;
    referral: number;
  };
  chargePrice: number;
  referralReward: {
    normal: { amount: number };
    premium: { amount: number };
  };
}
