import { createAndroidManagementClient } from "@/lib/emm/client";
import { decryptEMMProject } from "@/lib/emm/project";
import { createDefaultPolicy } from "@/app/api/emm/callback/create-or-updata-policy";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  // URLのクエリパラメータから'token'を取得
  const enterpriseToken = requestUrl.searchParams.get("enterpriseToken");
  const cookieStore = await cookies();
  const encryptedData = cookieStore.get("emm_signup_object");
  if (enterpriseToken && encryptedData) {
    // Supabaseクライアントを作成
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not found");
    }
    const {
      projectId,
      name: signupUrlName,
      projectName,
    } = decryptEMMProject(encryptedData.value);
    //Cookieを削除
    cookieStore.delete("emm_signup_object");

    // token,signupUrl,でenterpriseを作成する。
    const androidmanagement = await createAndroidManagementClient();

    // const logo = {
    //   url: "https://sample-site-pearl.vercel.app/images/logo.png",
    //   sha256Hash: "zwB79wWGgXq7V5Yk1Jt6khr1BrsM2msHYszD9MOa9Cc=",
    // };
    const requestBody = {
      // request body parameters
      // {
      //   "appAutoApprovalEnabled": false,
      //   "contactInfo": {},
      enabledNotificationTypes: [
        "ENROLLMENT",
        "STATUS_REPORT",
        "COMMAND",
        "USAGE_LOGS",
      ],
      enterpriseDisplayName: projectName,
      // logo,
      //   "name": "my_name",
      //   "primaryColor": 0,
      pubsubTopic: process.env.GCP_PUBSUB_TOPIC,
      //   "signinDetails": [],
      //   "termsAndConditions": []c
      // }
    };
    const { data: enterpriseData } = await androidmanagement.enterprises
      .create({
        enterpriseToken,
        projectId: process.env.GCP_PROJECT_ID,
        signupUrlName,
        requestBody,
      })
      .catch((error) => {
        console.error("Error creating enterprise:", error);
        throw new Error("Error creating enterprise");
      });

    if (!enterpriseData.name) {
      throw new Error("Enterprise name not found");
    }
    const enterpriseId = enterpriseData.name.split("enterprises/")[1];
    // まず既存のエンタープライズを確認
    const { data: existingEnterprise } = await supabase
      .from("enterprises")
      .select()
      .eq("enterprise_id", enterpriseId)
      .single();

    // 成功したら、応答文からenterprise_idを取得し、enterprisesテーブルにアップサート
    const { data: enterprise, error: upsertEnterpriseError } = await supabase
      .from("enterprises")
      .upsert(
        {
          enterprise_id: enterpriseId,
          enterprise_details: enterpriseData as Json,
          updated_at: new Date().toISOString(),
          // 既存のエンタープライズがある場合は owner_id を変更しない
          ...(existingEnterprise ? {} : { owner_id: user.id }),
        },
        {
          onConflict: "enterprise_id",
        }
      )
      .select()
      .single();
    if (upsertEnterpriseError) {
      console.error("Error upsert enterprise:", upsertEnterpriseError);
      throw new Error("Error upsert enterprise");
    }
    if (!enterprise) {
      throw new Error("Error upsert enterprise"); // RLSで、エンタープライズIDにアクセスできない場合にエラーをスローする
    }

    // 応答文を　enterprise_settings_historyテーブルに保存
    const { error: enterpriseHistoryError } = await supabase
      .from("enterprise_history")
      .insert({
        enterprise_id: enterpriseId,
        request_details: requestBody,
        response_details: enterpriseData as Json,
      });
    if (enterpriseHistoryError) {
      console.error(
        "Error inserting enterprises_histories:",
        enterpriseHistoryError
      );
      throw new Error("Error inserting enterprises_histories");
    }

    // projectsテーブルを更新し、enterprise_idをセット
    const { error: projectsError } = await supabase
      .from("projects")
      .update({ enterprise_id: enterpriseId })
      .eq("project_id", projectId);
    if (projectsError) {
      console.error("Error updating projects:", projectsError);
      throw new Error("Error updating projects");
    }

    // defaultポリシーを作成
    await createDefaultPolicy(enterpriseId).catch((error) => {
      console.error("Error creating default policy:", error);
      throw new Error("Error creating default policy");
    });

    redirect(`/${enterpriseId}/devices`);
  }
  redirect("/error");
}
