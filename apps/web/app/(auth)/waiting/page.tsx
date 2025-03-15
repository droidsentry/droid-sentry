import { createClient } from "@/lib/supabase/server";
import WaitingForm from "./components/waiting-form";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userMetadata = user?.user_metadata;
  const username =
    userMetadata?.username ||
    userMetadata?.name ||
    userMetadata?.full_name ||
    userMetadata?.user_name ||
    userMetadata?.preferred_username;
  const email = userMetadata?.email;
  return (
    <div className="sm:absolute inset-0 flex place-items-center">
      <div className="m-auto max-w-lg p-4 md:mt-20">
        <WaitingForm username={username} email={email} />
      </div>
    </div>
  );
}
