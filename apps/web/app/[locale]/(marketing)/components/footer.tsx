import { AppConfig } from "@/app.config";
import HeaderLogoButton from "@/components/header-logo-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getScopedI18n } from "@/locales/server";

export default async function Footer() {
  const scopedI18n = await getScopedI18n("footer");
  return (
    <footer className="sticky top-full pt-[60px] pb-[100px] bg-card">
      <div className="container mx-auto md:px-6 px-4 xl:px-[70px] ">
        <HeaderLogoButton className="h-12" />
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 gap-4 lg:flex sm:justify-between mt-[60px]"
          )}
        >
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">{scopedI18n("products")}</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit">
                {scopedI18n("plan")}
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">{scopedI18n("companyInfo")}</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0">
              <Button variant="ghost" className="w-fit" asChild>
                <Link href="/terms">{scopedI18n("terms")}</Link>
              </Button>
              <Button variant="ghost" className="w-fit" asChild>
                <Link href="/privacy">{scopedI18n("privacy")}</Link>
              </Button>
              <Button variant="ghost" className="w-fit" asChild>
                <Link href="/legal">{scopedI18n("legal")}</Link>
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">{scopedI18n("resources")}</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit">
                {scopedI18n("blog")}
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">{scopedI18n("support")}</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit">
                {scopedI18n("supportEmail")}
              </Button>
              <Button variant="ghost" className="w-fit">
                {scopedI18n("helpCenter")}
              </Button>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="text-muted-foreground">&copy; {AppConfig.company}</div>
      </div>
    </footer>
  );
}
