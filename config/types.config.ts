export type Config = {
  initial_state: {
    points: number;
    energy: number;
    ar: number;
  };
  limits: {
    points: number;
    energy: number;
    referral: 48;
  };
  passive_income: {
    points: {
      amount: number;
      interval: number;
    };
    energy: {
      amount: number;
      interval: number;
    };
  };
  rewards: {
    referral: {
      type: 'ar';
      amount: number;
    };
  };
};
