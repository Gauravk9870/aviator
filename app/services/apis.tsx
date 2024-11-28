import { config } from "@/lib/config";


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
