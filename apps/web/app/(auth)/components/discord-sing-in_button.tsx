import { signInWithDiscord } from "@/actions/auth-social ";
import { cn } from "@/lib/utils";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import SubmitButton from "./submit-button";

export default function DiscordSingInButton({
  className,
}: {
  className?: string;
}) {
  return (
    <form action={signInWithDiscord}>
      <SubmitButton className={cn(className)}>
        <SiDiscord className="mr-4 size-5" />
        <span>Discord</span>
      </SubmitButton>
    </form>
  );
}
