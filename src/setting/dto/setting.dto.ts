export class SettingDto {
  limits: {
    points: number;
    energy: number;
    referral: number;
  };
  price: {
    recovery: {
      points: {
        amount: number;
      };
    };
    tap: {
      points: {
        amount: number;
      };
      ar: {
        amount: number;
      };
    };
  };
  referralReward: {
    normal: { amount: number };
    premium: { amount: number };
  };
}
