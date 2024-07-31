export type Config = {
  initial_state: {
    points: number;
    energy: number;
    ar: number;
  };
  limits: {
    points: number;
    energy: number;
    referral: number;
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
      premium: {
        amount: number;
      };
      normal: {
        amount: number;
      };
    };
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
};
