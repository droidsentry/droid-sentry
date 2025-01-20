import { signInWithGoogle } from "@/actions/auth-social ";
import { cn } from "@/lib/utils";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import SubmitButton from "./submit-button";

export default function GoogleSingInButton({
  className,
}: {
  className?: string;
}) {
  return (
    <form action={signInWithGoogle}>
      <SubmitButton className={cn(className)}>
        <SiGoogle className="mr-4 size-5" />
        <span>Google</span>
      </SubmitButton>
    </form>
  );
}
