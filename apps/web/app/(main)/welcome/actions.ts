"use server";

import { createTrialSubscription } from "@/app/api/auth/confirm/lib/create-trial-subscription";
import { OnboardingUserSchema } from "@/app/schemas/project";
import { OnboardingUser } from "@/app/types/project";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function registerOnboardingUser(data: OnboardingUser) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    console.error(userError.message);
    throw new Error("ユーザー情報の取得に失敗しました。");
  }
  if (!user) {
    throw new Error("ユーザー情報が取得できませんでした。");
  }

  const result = await OnboardingUserSchema.safeParseAsync(data);
  if (!result.success) {
    throw new Error("ユーザー情報が不正です。");
  }
  const { username, email, agreeToTerms } = result.data;

  if (email !== user.email) {
    throw new Error("変更されたメールアドレスでは登録できません。");
  }

  const currentIsoTimestamp = new Date().toISOString();
  const { error: dbError } = await supabase.from("users").insert([
    {
      user_id: user.id,
      email: email,
      username: username,
      updated_at: currentIsoTimestamp,
      agree_to_terms: agreeToTerms,
    },
  ]);
  revalidatePath("/");
  revalidatePath("/welcome");

  if (dbError) {
    console.error(dbError.message);
    throw new Error("ユーザー情報の登録に失敗しました。");
  }

  const userId = user.id;
  await createTrialSubscription(userId);

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      username: data.username,
      has_created_project: null,
      is_onboarding_completed: true,
    },
  });
  if (updateError) {
    console.error(updateError.message);
    throw new Error("ユーザー名の更新に失敗しました。");
  }
}
