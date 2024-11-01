import { config as conf } from "dotenv";
conf();

const _config = {
  userToken: process.env.NEXT_PUBLIC_USERTOKEN,
  serverUrl: process.env.NEXT_PUBLIC_URL,
};
export const config = Object.freeze(_config);
