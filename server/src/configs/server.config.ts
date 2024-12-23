export const SERVER_CONFIG = Object.freeze({
  APP_PORT: Number(process.env.APP_PORT) || 8081,
  SOCKET_PORT: Number(process.env.APP_PORT) || 8080,
});
