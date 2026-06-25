const parseSocketInstances = () => {
  const socketPorts =
    process.env.SOCKET_PORTS || process.env.SOCKET_PORT || '8081';

  return socketPorts.split(',').map((port, index) => ({
    name: `socket-${index + 1}`,
    port: Number(port.trim()),
  }));
};

export const SERVER_CONFIG = Object.freeze({
  APP_PORT: Number(process.env.APP_PORT) || 8080,
  SOCKET_INSTANCES: parseSocketInstances(),
});
