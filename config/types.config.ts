export type Config = {
  initial_player_assets: {
    points: number;
    energy: number;
    ambers: number;
  };
  player_limits: {
    points: number;
    energy: number;
    referrals: number;
  };
  full_recovery_time: {
    points: number;
    energy: number;
  };
  referral_rewards: {
    premium: number;
    normal: number;
  };
  action_price: {
    full_charge_points: number;
  };
};
