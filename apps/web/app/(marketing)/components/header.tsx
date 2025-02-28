import HeaderLogoButton from "@/components/header-logo-button";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { cn } from "../../../lib/utils";
import { LocaleToggle } from "./locale-toggle";
import MobileHeaderMenu from "./mobile-header-menu";
import SingInButton from "./sign-in-button";
import StartFreeAccountButton from "./start-free-account-button";

export default async function Header({ className }: { className?: string }) {
  const t = await getTranslations("marketing.header");
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-10 flex justify-center h-fit lg:h-[84px]",
        className
      )}
    >
      <div className="container mx-auto md:px-6 px-4 xl:px-[70px] flex flex-grow items-center">
        <div className="flex items-center flex-1 justify-start">
          <HeaderLogoButton />
          <div className="hidden lg:flex flex-1 ml-5 items-center">
            <Button variant="ghost" className="p-5" asChild>
              <Link href="/" replace>
                <span className="text-lg">{t("flowOfUse")}</span>
              </Link>
            </Button>
            <Button variant="ghost" className="p-5" asChild>
              <Link href="/" replace>
                <span className="text-lg">{t("plan")}</span>
              </Link>
            </Button>
            <Button variant="ghost" className="p-5" asChild>
              <Link href="/" replace>
                <span className="text-lg">{t("blog")}</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="lg:flex items-center gap-4 hidden">
          <LocaleToggle />
          <SingInButton className="ml-0" />
          <StartFreeAccountButton />
        </div>
        <div className="lg:hidden">
          <MobileHeaderMenu />
        </div>
      </div>
    </header>
  );
}
