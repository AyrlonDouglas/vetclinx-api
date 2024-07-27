export interface BaseConfig {
  appPort: number;
  appMode: string;
  database: {
    host: string;
    port: number;
  };
}
