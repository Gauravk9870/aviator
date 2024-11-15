import { config as conf } from "dotenv";
conf();

const _config = {
  token: process.env.NEXT_PUBLIC_USERTOKEN,
  server: process.env.NEXT_PUBLIC_URL,
  ws: process.env.NEXT_PUBLIC_WS_URL,
  gameLimits: process.env.NEXT_PUBLIC_GAMELIMITS,
  howToPlay: process.env.NEXT_PUBLIC_HOWTOPLAY,
  gamesRule: process.env.NEXT_PUBLIC_GAMERULES
};
export const config = Object.freeze(_config);
