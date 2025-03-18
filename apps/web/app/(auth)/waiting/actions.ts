"use server";

import { getBaseURL } from "@/lib/base-url";
import { getUserContextData } from "@/lib/context/user-context";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import {
  sendEmailToWaitingUserSchema,
  waitingUserSchema,
} from "@/lib/schemas/waiting";
import { createAdminClient } from "@/lib/supabase/admin";
import { WaitingUser } from "@/lib/types/waiting";

const DUPLICATE_ERROR_CODE = "23505";

export const sendEmailToWaitingUser = async (waitingUser: WaitingUser) => {
  const parseResult = await waitingUserSchema.safeParseAsync(waitingUser);
  if (!parseResult.success) {
    throw new Error("入力データが無効です: " + parseResult.error.message);
  }
  const { username, email } = parseResult.data;
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from("waiting_users").insert({
    username,
    email,
  });

  if (error && error.code !== DUPLICATE_ERROR_CODE) {
    throw new Error("データベースへの保存に失敗しました");
  }

  const baseUrl = getBaseURL();
  const userContextData = await getUserContextData();
  const now = formatToJapaneseDateTime();

  const emailContext = {
    username,
    email,
    ip_address: userContextData.ip_address,
    createdAt: now,
    location: userContextData.location,
  };
  const parsedEmailContext = sendEmailToWaitingUserSchema.parse(emailContext);

  const response = await fetch(`${baseUrl}/api/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsedEmailContext),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "メール送信に失敗しました");
  }

  return data;
};
