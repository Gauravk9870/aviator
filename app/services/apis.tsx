import { config } from "@/lib/config";
//verifyToken
export const verifyToken = async () => {
  try {
    const res = await fetch(`${config.server}/api/user/verifyToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.token}`,
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

//getBetsByUser
export const getBetsByUser = async (userId: string) => {
  try {
    const res = await fetch(`${config.server}/api/aviator/getBets/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.token}`,
      },
    });
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
    const res = await fetch(`${config.server}/api/aviator/getCrashPoint`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.token}`,
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
    console.log(config.token);
    const res = await fetch(
      `${config.server}/api/aviator/aviatorSetting/${settingName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${config.token}`,
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
    const res = await fetch(`${config.server}/api/aviator/getLogo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.token}`,
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
    const res = await fetch(`${config.server}/api/user/updateAvtar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${config.token}`,
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
//

export const getTopBets = async function getTopBets(
  category: 'hugeWins' | 'biggestWins' | 'MULTIPLIERs',
  filter: 'today' | 'month' | 'year'
): Promise<any[] | null> {
  try {
    const response = await fetch(`${config.server}/api/aviator/getTopBets/${category}/${filter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${config.token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch: ", response.statusText);
      return null;
    }

    const resultText = await response.text();
    const result = resultText ? JSON.parse(resultText) : { status: false, data: [], message: "Empty response" };

    if (result.status) {
      console.log("Top Bets Fetched Successfully:", result.data);
      return result.data;
    } else {
      console.log(result.message || "No Top Bets Found");
      return result.data || [];
    }
  } catch (error) {
    console.error("An error occurred while fetching Top Bets:", error);
    return null;
  }
};
