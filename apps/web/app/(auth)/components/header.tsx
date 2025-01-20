import HeaderLogoButton from "@/components/header-logo-button";
import { cn } from "../../../lib/utils";

export default async function Header({ className }: { className?: string }) {
  return (
    <header className={cn("px-2 py-4 flex items-center gap-1", className)}>
      <HeaderLogoButton />
    </header>
  );
}
