"use server";

import { waitingSchema } from "@/app/schemas/auth";
import { Waiting } from "@/app/types/auth";
import { getBaseURL } from "@/lib/base-url/client";
import { getUserContextData } from "@/lib/context/user-context";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const DUPLICATE_ERROR_CODE = "23505";

export const sendWaitingNotification = async (userData: Waiting) => {
  try {
    const result = await waitingSchema.safeParseAsync(userData);
    if (result.success === false) {
      console.error(result.error);
      throw new Error("フォームデータの検証に失敗しました");
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from("waiting_users").insert({
      username: userData.username,
      email: userData.email,
      updated_at: new Date().toISOString(),
      status: "waiting",
    });
    if (error) {
      if (error.code !== DUPLICATE_ERROR_CODE) {
        throw new Error("データベースへの保存に失敗しました");
      }
    }

    const baseUrl = getBaseURL();
    const userContextData = await getUserContextData();
    const now = formatToJapaneseDateTime();
    const response = await fetch(`${baseUrl}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        ip_address: userContextData.ip_address,
        createdAt: now,
        location: userContextData.location,
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
