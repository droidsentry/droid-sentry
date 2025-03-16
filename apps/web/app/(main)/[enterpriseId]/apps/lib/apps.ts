import "server-only";

import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { selectAppFields } from "../data/select-app-fields";
import { AppDetails } from "@/app/types/apps";

// DBにアプリの情報を保存する
export const saveApp = async ({
  appDetails,
  enterpriseId,
  appType,
}: {
  appDetails: AppDetails;
  enterpriseId: string;
  appType: string;
}) => {
  if (!appDetails.name) {
    throw new Error("App name is required");
  }
  const supabase = await createClient();
  // IDを取得する際に、RLSにより認証を行っている
  const packageName = appDetails.name.split(
    `enterprises/${enterpriseId}/applications/`
  )[1];

  const { data, error } = await supabase
    .from("apps")
    .upsert(
      {
        package_name: packageName,
        enterprise_id: enterpriseId,
        app_type: appType,
        app_details: appDetails as Json,
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
