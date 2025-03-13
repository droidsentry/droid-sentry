import { signWithGoogle } from "@/actions/auth/auth-social ";
import { cn } from "@/lib/utils";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import SubmitButton from "./submit-button";

export default function GoogleSingButton({
  className,
}: {
  className?: string;
}) {
  return (
    <form action={signWithGoogle}>
      <SubmitButton className={cn(className)}>
        <SiGoogle className="mr-4 size-5" />
        <span>Google</span>
      </SubmitButton>
    </form>
  );
}
