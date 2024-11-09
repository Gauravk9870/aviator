const _config = {
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    ws: process.env.NEXT_PUBLIC_WS_URL,
    userToken: process.env.NEXT_PUBLIC_USERTOKEN,
  };
  
  export const config = Object.freeze(_config);
  