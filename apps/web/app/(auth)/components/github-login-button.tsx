import { signInWithGithub } from "@/actions/auth-social ";
import { cn } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import SubmitButton from "./submit-button";

export function GitHubLoginButton({ className }: { className?: string }) {
  return (
    <form action={signInWithGithub}>
      <SubmitButton className={cn(className)}>
        <SiGithub className="mr-4 size-5" />
        <span>Discord</span>
      </SubmitButton>
    </form>
  );
}
