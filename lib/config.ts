import { config as conf } from "dotenv";
conf();

const _config = {
  token: process.env.NEXT_PUBLIC_USERTOKEN,
  server: process.env.NEXT_PUBLIC_URL,
  ws: process.env.NEXT_PUBLIC_WS_URL,
};
export const config = Object.freeze(_config);
