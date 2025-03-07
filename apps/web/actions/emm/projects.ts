"use server";

import { onboardingSchema } from "@/app/schemas/onboarding-schema";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

type FormData = z.infer<typeof onboardingSchema>;

/**
 * プロジェクトの作成
 * @param data
 * @returns project
 */
export const createProject = async (data: FormData) => {
  // console.log("createProject", data);
  const parsedData = await onboardingSchema.safeParseAsync(data);
  if (parsedData.success === false) {
    console.error(parsedData.error);
    throw new Error("フォームデータの検証に失敗しました");
  }

  const supabase = await createClient();
  const { projectName, organizationName } = data;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log(authUser);
  if (!user) {
    throw new Error("ユーザー情報が取得できませんでした");
  }

  // プロジェクトの作成
  const currentIsoTimestamp = new Date().toISOString();
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      project_name: projectName,
      organization_name: organizationName,
      updated_at: currentIsoTimestamp,
    })
    .select()
    .single();

  if (projectError) {
    console.error("プロジェクト作成エラー:", projectError);
    throw new Error("プロジェクトの作成に失敗しました");
  }
  const { error: managementError } = await supabase
    .from("project_members")
    .insert({
      project_id: project.project_id,
      user_id: user.id,
      role: "OWNER",
      updated_at: currentIsoTimestamp,
    });
  if (managementError) {
    console.error("プロジェクトユーザー紐付けエラー:", managementError);
    throw new Error("プロジェクトとユーザーの紐付けに失敗しました");
  }
  // userメタデータにプロジェクト作成フラグを立てる
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      // has_created_project: false,
      has_created_project: true,
    },
  });
  if (metadataError) {
    console.error("メタデータ更新エラー:", metadataError);
    throw new Error("メタデータの更新に失敗しました");
  }
  return project;
};
