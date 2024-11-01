import React from "react";
const Socket = () => {
  const socket = new WebSocket("ws://88.222.215.60/ws/");
  socket.onopen = () => {
    console.log("Connected to WebSocket");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("Received message:", message);
    if (message.message === "Welcome to Aviator!") {
      console.log("Welcome Message:", message);
    } else if (message.multiplier === "SessionId") {
      console.log("Session Created:", message);
    } else if (message.multiplier === "Started") {
      console.log("Session Started:", message);
    } else if (message.multiplier === "Crashed") {
      console.log("Session Ended with Crash:", message);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.log("WebSocket error:", error);
  };

  return <div>socket</div>;
};

export default Socket;
