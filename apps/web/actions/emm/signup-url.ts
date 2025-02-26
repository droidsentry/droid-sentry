"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAndroidManagementClient } from "./client";
import { encryptData } from "./crypto";

/**
 *　サインアップURLを取得する
 * @param projectId ProjectテーブルのテーブルID
 * @param url リダイレクト先のURL　例: `${process.env.HOST}/api/emm/callback`　※https必須
 */
export const getSignUpUrl = async (
  projectId: string,
  url: string,
  projectName: string
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const androidmanagement = await createAndroidManagementClient();
  const { data } = await androidmanagement.signupUrls
    .create({
      // callbackUrl: process.env.EMM_SIGNUP_URL + "/api/emm/callback",
      // callbackUrl: `${process.env.HOST}/api/emm/callback
      callbackUrl: `${url}/api/emm/callback`,
      projectId: process.env.GCP_PROJECT_ID,
    })
    .catch((error) => {
      console.error("Error creating signup URL:", error.message);
      throw new Error(error.message);
    });
  // console.log("data", data);
  if (!data.url) {
    throw new Error("Signup URL not found");
  }
  if (!data.name) {
    throw new Error("Signup URL name not found");
  }

  // URLを暗号化してCookieに保存
  const cookieStore = await cookies();
  const encryptedUrl = encryptData({ name: data.name, projectId, projectName }); // セキュリティのため暗号化
  // console.log("暗号化:", encryptedUrl);

  cookieStore.set("emm_signup_object", encryptedUrl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600, // 1時間で有効期限切れ
    path: "/",
  });
  const encryptedData = cookieStore.get("emm_signup_object");
  // console.log("encryptedData", encryptedData);
  redirect(data.url);
};
