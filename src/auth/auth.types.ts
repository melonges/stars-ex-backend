export type ParsedTelegramInitData = {
  query_id?: string;
  user: User;
  auth_date: string;
  hash: string;
};

type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  allows_write_to_pm: boolean;
};

export type AuthConfig = {
  JWT_SECRET: string;
};
