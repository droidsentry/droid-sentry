import { createClient } from "@/lib/supabase/server";
import OnboardingForm from "./onboarding-form";
import { checkTotalUserLimit } from "@/lib/service";
import { redirect } from "next/navigation";

export default async function Page() {
  await checkTotalUserLimit().catch((error) => {
    const errorCode = error.message;
    if (errorCode === "E1001") {
      console.log(errorCode);
      redirect("/waiting");
    }
  });

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
  const userMetadata = user.user_metadata;
  const username =
    userMetadata.username ||
    userMetadata.name ||
    userMetadata.full_name ||
    userMetadata.user_name ||
    userMetadata.preferred_username;
  const email = userMetadata.email;

  return (
    <div className="lg:absolute inset-0 flex place-items-center p-4">
      <div className="mx-auto flex gap-5">
        <OnboardingForm username={username} email={email} />
      </div>
    </div>
  );
}
