import "server-only";

import { createClient } from "@/lib/supabase/server";
import { ProjectWithEnterpriseRelation } from "@/lib/types/project";

/**
 * プロジェクト一覧を取得
 * @returns プロジェクト一覧
 *
 * project_membersテーブルを直接参照して
 * RLSポリシーにより：
 * プロジェクトオーナー（subscription_owner_id = auth.uid()）
 * または、プロジェクトメンバー（is_project_user(id)がtrueを返す）
 * のプロジェクトのみが取得されますが、project_membersテーブルを
 * 直接参照して明示的にプロジェクト一覧を取得します。
 */
export const getProjects = async (): Promise<
  ProjectWithEnterpriseRelation[]
> => {
  const supabase = await createClient();

  // ユーザー認証チェック
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // プロジェクト一覧を取得
  const { data, error } = await supabase
    .from("project_members")
    .select(
      `
      ...projects (
      *
      )
    `
    )
    .eq("user_id", user.id);

  if (error) {
    console.error("Error getting projects:", error);
    throw new Error("Error getting projects");
  }

  return data || [];

  // 本来、プロジェクトが削除されると関連するproject_membersのレコードも自動的に削除される(CASCADE)ため
  // project_membersテーブルにはnullのプロジェクトが存在しない.
  // ただ、データ型の都合上、nullがある場合がある。
  // 下記のようにnullがある場合がある。
  // const data = [
  //   { projects: { id: 1, name: "Project A" } },
  //   { projects: null },
  //   { projects: { id: 2, name: "Project B" } }
  // ];
  // nullのプロジェクトを除外し、型安全な配列を返す
  // return (
  //   data
  //     // 1. mapで projects プロパティだけを取り出す
  //     // 結果: [{ id: 1, name: "Project A" }, null, { id: 2, name: "Project B" }]
  //     .map((item) => item.projects)
  //     // 2. filterでnullを除外し、型安全な配列にする
  //     // 結果: [{ id: 1, name: "Project A" }, { id: 2, name: "Project B" }]
  //     // NonNullable<T>を使って、nullを除外し、型安全な配列にする
  //     .filter(
  //       (project): project is NonNullable<typeof project> => project !== null
  //     )
  // 下記のでもnullは除外できるが、TypeScriptのfilterメソッドの型定義が、
  // デフォルトでは配列の要素の型を変更しないように設計されているため,
  // data: (ProjectData | null)[] と推論する
  // .filter(project => project !== null);
  //
  // NonNullable<T>は、TypeScriptの組み込み型で、
  // 型Tからnullとundefinedを除外した型を生成
  // NonNullable<T>の定義
  // type NonNullable<T> = T extends null | undefined ? never : T;
  // 例
  // type Example = string | null | undefined;
  // type SafeExample = NonNullable<Example>; // string型になる
  // );
};
