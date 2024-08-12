export interface AppConfig {
  env: string;
  port: number;
  appName: string;
}

export interface DatabaseConfig {
  mongoDB: { uri: string };
}

export interface AuthConfig {
  secretKey: string;
  expiresIn: string;
}

export const ConfigKey = {
  app: 'app',
  db: 'db',
  auth: 'auth',
} as const;

export const Environment = {
  dev: 'development',
  prod: 'production',
};

export type BaseConfig = {
  APP: AppConfig;
  DB: DatabaseConfig;
  AUTH: AuthConfig;
};
