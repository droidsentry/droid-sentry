export type DroidSentryWaitingNotificationEmailProps = {
  username: string;
  projectName: string;
  email: string;
  ip_address: string;
  createdAt: string;
  location: string;
};

export const sendWaitingNotification = async (
  userData: DroidSentryWaitingNotificationEmailProps
) => {
  try {
    const response = await fetch("/api/send/waiting-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        projectName: userData.projectName,
        email: userData.email,
        ip_address: userData.ip_address,
        createdAt: new Date().toLocaleString("ja-JP"),
        location: userData.location || "不明",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "メール送信に失敗しました");
    }

    return data;
  } catch (error) {
    console.error("メール送信エラー:", error);
    throw error;
  }
};
