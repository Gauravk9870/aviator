import { config } from "./config";
//verifyToken
export const verifyToken = async () => {
  try {
    const res = await fetch(`${config.serverUrl}/api/user/verifyToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.userToken}`,
      },
    });
    const data = await res.json();
    if (!data.status) {
      console.log("Token verification failed:", data.message);
      return null;
    }
    console.log("Token verified successfully:", data.data);
    return data.data;
  } catch (err) {
    console.error("Error verifying token:", err);
    throw new Error("An error occurred during token verification.");
  }
};
//PlaceBet

export const placeBet = async (
  userId: string,
  amount: number,
  socket: WebSocket | null
) => {
  try {
    const res = await fetch(`${config.serverUrl}/api/aviator/place-bet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.userToken}`,
      },
      body: JSON.stringify({ userId, amount }),
    });

    const data = await res.json();

    if (data.error) {
      console.log(data.error);
    } else if (data.status && data.bet) {
      console.log("Bet placed successfully:", data.bet);

      // Emit WebSocket message for "BETS" event
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "BETS",
            data: {
              userId,
              amount,
              sessionId: data.bet.sessionId,
              cashedOut: false,
              cashOutMultiplier: 1,
              ...data.bet,
            },
          })
        );
      }

    
    }
  } catch (err) {
    console.error("Error placing bet:", err);
    console.error("An error occurred while placing the bet.");
  }
};

//cashOut
export const cashOut = async (userId: string, currentMultiplier: number) => {
  try {
    const res = await fetch(`${config.serverUrl}/api/aviator/cash-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.userToken}`,
      },
      body: JSON.stringify({ userId, currentMultiplier }),
    });

    const data = await res.json();

    if (data.error) {
      console.log(data.error);
    } else if (data.status) {
      console.log("Cash out successful. Payout amount:", data.payout);
    }
  } catch (err) {
    console.error("Error during cash out:", err);
    console.error("An error occurred while processing the cash out.");
  }
};
//getBetsByUser
export const getBetsByUser = async (userId: string) => {
  try {
    const res = await fetch(
      `${config.serverUrl}/api/aviator/getBets/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${config.userToken}`,
        },
      }
    );
    const data = await res.json();
    if (data.status && data.data) {
      console.log("Bets fetched successfully:", data.data);
      return data.data;
    } else if (!data.status && data.message === "No bets found") {
      // console.log("No bets found for this user.");
      return [];
    } else {
      console.log("Error fetching bets:", data.message);
    }
  } catch (err) {
    console.error("Error fetching bets:", err);
    throw new Error("An error occurred while fetching the bets.");
  }
};

//getCrashPoints

export const getCrashPoints = async () => {
  try {
    const res = await fetch(`${config.serverUrl}/api/aviator/getCrashPoint`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.userToken}`,
      },
    });

    const data = await res.json();
    if (!data.status) {
      console.log("Error fetching crash points:", data.message);
      return null;
    }

    console.log("Crash Points:", data.data);
    return data.data;
  } catch (err) {
    console.error("Error fetching crash points:", err);
    throw new Error("An error occurred while fetching crash points.");
  }
};
//getAviatorSetting
export const getAviatorSetting = async (settingName: string) => {
  try {
    const res = await fetch(
      `${config.serverUrl}/api/aviator/aviatorSetting/${settingName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${config.userToken}`,
        },
      }
    );

    const data = await res.json();

    if (data.status) {
      console.log(`${settingName} fetched successfully:`, data.data);
      return data.data;
    } else {
      console.log(`Error fetching ${settingName}:`, data.message);
      return null;
    }
  } catch (err) {
    console.error(`Error fetching ${settingName}:`, err);
    throw new Error(`An error occurred while fetching ${settingName}.`);
  }
};
//getGameLogo
export const getGameLogo = async () => {
  try {
    const res = await fetch(`${config.serverUrl}/api/aviator/getLogo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.userToken}`,
      },
    });

    const data = await res.json();

    if (data.status) {
      console.log("Game logo fetched successfully:", data.data);
      return data.data;
    } else {
      console.log("Error fetching game logo:", data.message);
      return null;
    }
  } catch (err) {
    console.error("Error fetching game logo:", err);
    throw new Error("An error occurred while fetching the game logo.");
  }
};
//updateAvatar
export const updateAvatar = async (userEmail: string, avatar: string) => {
  try {
    const res = await fetch(`${config.serverUrl}/api/user/updateAvtar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.userToken}`,
      },
      body: JSON.stringify({ userEmail, avatar }),
    });
    const data = await res.json();
    if (data.status) {
      console.log("Avatar updated successfully:", data.message);
    } else {
      console.error("Failed to update avatar:", data.message);
    }
    return data;
  } catch (err) {
    console.error("Error updating avatar:", err);
  }
};
