const _config = {
  server: process.env.NEXT_PUBLIC_SERVER_URL,
  ws: process.env.NEXT_PUBLIC_WS_URL,
  token: process.env.NEXT_PUBLIC_TOKEN,
};

export const config = Object.freeze(_config);
