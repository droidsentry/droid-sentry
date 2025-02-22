import "server-only";

import { createClient } from "@/lib/supabase/server";
import { androidmanagement_v1 } from "googleapis";
import { Json } from "@/types/database";
import { selectAppFields } from "../data/select-app-fields";

type AppData = androidmanagement_v1.Schema$Application;

// DBにアプリの情報を保存する
export const saveApp = async ({
  appData,
  enterpriseId,
  appType,
}: {
  appData: AppData;
  enterpriseId: string;
  appType: string;
}) => {
  if (!appData.name) {
    throw new Error("App name is required");
  }
  const supabase = await createClient();
  // IDを取得する際に、RLSにより認証を行っている
  const packageName = appData.name.split(
    `enterprises/${enterpriseId}/applications/`
  )[1];

  const { data, error } = await supabase
    .from("apps")
    .upsert(
      {
        package_name: packageName,
        enterprise_id: enterpriseId,
        app_type: appType,
        app_data: appData as Json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "enterprise_id, package_name" }
    )
    .select(selectAppFields)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
