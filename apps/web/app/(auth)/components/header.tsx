import { LocaleToggle } from "@/app/(marketing)/components/locale-toggle";
import HeaderLogoButton from "@/components/header-logo-button";
import { cn } from "@/lib/utils";

export default async function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "px-2 py-4 flex items-center gap-1 h-fit lg:h-[84px] border-b",
        className
      )}
    >
      <div className="flex items-center flex-1 justify-start">
        <HeaderLogoButton />
      </div>
      <div className="flex items-center">
        <LocaleToggle />
      </div>
    </header>
  );
}
