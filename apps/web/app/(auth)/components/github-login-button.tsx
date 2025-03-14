import { signWithGithub } from "@/actions/auth/supabase";
import { cn } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import SubmitButton from "./submit-button";

export function GitHubSignButton({ className }: { className?: string }) {
  return (
    <form action={signWithGithub}>
      <SubmitButton className={cn(className)}>
        <SiGithub className="mr-4 size-5" />
        <span>GitHub</span>
      </SubmitButton>
    </form>
  );
}
