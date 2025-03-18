"use server";

import { projectSchema } from "@/lib/schemas/project";
import { Project } from "@/lib/types/project";
import { createClient } from "@/lib/supabase/server";
import { checkProjectLimit } from "./service";

/**
 * プロジェクトの作成
 * @param data
 * @returns project
 */
export const createProject = async (data: Project) => {
  const parsedData = await projectSchema.safeParseAsync(data);
  if (parsedData.success === false) {
    console.error(parsedData.error);
    throw new Error("フォームデータの検証に失敗しました");
  }

  const supabase = await createClient();
  const { projectName, organizationName } = data;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ユーザー情報が取得できませんでした");
  }

  await checkProjectLimit();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      project_name: projectName,
      organization_name: organizationName,
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
    });
  if (managementError) {
    console.error("プロジェクトユーザー紐付けエラー:", managementError);
    throw new Error("プロジェクトとユーザーの紐付けに失敗しました");
  }

  return project;
};
