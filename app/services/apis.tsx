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
      
      return null;
    }
    
    return data.data;
  } catch (err) {
    console.error("Error verifying token:", err);
    throw new Error("An error occurred during token verification.");
  }
};
//getAviatorSetting
export const getAviatorSetting = async (settingName: string, token: string) => {
  try {
    const res = await fetch(
      `${config.server}/api/aviator/aviatorSetting/${settingName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.status) {
      
      return data.data;
    } else {
      
      return null;
    }
  } catch (err) {
    console.error(`Error fetching ${settingName}:`, err);
    throw new Error(`An error occurred while fetching ${settingName}.`);
  }
};
//getGameLogo
export const getGameLogo = async (token: string) => {
  try {
    const res = await fetch(`${config.server}/api/aviator/getLogo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    const data = await res.json();

    if (data.status) {
      
      return data.data;
    } else {
      
      return null;
    }
  } catch (err) {
    console.error("Error fetching game logo:", err);
    throw new Error("An error occurred while fetching the game logo.");
  }
};
//updateAvatar
export const updateAvatar = async (
  userEmail: string,
  avtar: string,
  token: string
) => {
  try {
    const res = await fetch(`${config.server}/api/user/updateAvtar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ userEmail, avtar }),
    });
    const data = await res.json();
    if (data.status) {
      
    } else {
      console.error("Failed to update avatar:", data.message);
    }
    return data;
  } catch (err) {
    console.error("Error updating avatar:", err);
  }
};
