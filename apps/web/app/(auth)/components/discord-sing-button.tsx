"use client";

import { signWithDiscord } from "@/actions/auth/auth-social ";
import { cn } from "@/lib/utils";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import SubmitButton from "./submit-button";

export default function DiscordSingButton({
  className,
}: {
  className?: string;
}) {
  return (
    <form action={signWithDiscord}>
      <SubmitButton className={cn(className)}>
        <SiDiscord className="mr-4 size-5" />
        <span>Discord</span>
      </SubmitButton>
    </form>
  );
}
