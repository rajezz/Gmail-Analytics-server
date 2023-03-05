export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
          PORT: string;
          MONGODB_URI: string;
          MONGODB_URI_LOCAL: string;
          SESSION_SECRET: string;
          GOOGLE_CLIENT_ID: string;
          GOOGLE_CLIENT_SECRET: string;
        }
  }
}
