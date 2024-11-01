const _config = {
    server: process.env.NEXT_PUBLIC_SERVER_URL,
    ws: process.env.NEXT_PUBLIC_WS_URL,
  };
  
  export const config = Object.freeze(_config);
  