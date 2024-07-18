import { ReferralURL } from './telegram.types';

export const getReferralIdFromMatch = (match: string): Partial<ReferralURL> => {
  return { ref: match.match(/ref-(\d+)/)?.[1] };
};
