export interface AppConfig {
  env: string;
  port: number;
  appName: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const ConfigKey = {
  app: 'app',
  db: 'db',
} as const;

export const Environment = {
  dev: 'development',
  prod: 'production',
};

export type BaseConfig = {
  APP: AppConfig;
  DB: DatabaseConfig;
};
