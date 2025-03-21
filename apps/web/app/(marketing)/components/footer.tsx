import { AppConfig } from "@/app.config";
import HeaderLogoButton from "@/components/header-logo-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";

export default async function Footer() {
  const t = await getTranslations("marketing.footer");
  return (
    <footer className="sticky top-full pt-[60px] pb-[100px] bg-card">
      <div className="container mx-auto md:px-6 px-4 xl:px-[70px] ">
        <HeaderLogoButton className="h-12" />
        <div
          className={cn(
            // "grid grid-cols-1 sm:grid-cols-2 gap-4 lg:flex sm:justify-between mt-[60px]"
            "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:justify-center mt-[60px]"
          )}
        >
          {/* <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">{t("products")}</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit">
                {t("plan")}
              </Button>
            </div>
          </div> */}
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">{t("companyInfo")}</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0">
              <Button variant="ghost" className="w-fit" asChild>
                <Link href="/terms">{t("terms")}</Link>
              </Button>
              <Button variant="ghost" className="w-fit" asChild>
                <Link href="/privacy">{t("privacy")}</Link>
              </Button>
              <Button variant="ghost" className="w-fit" asChild>
                <Link href="/legal">{t("legal")}</Link>
              </Button>
            </div>
          </div>
          {/* <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">{t("resources")}</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit">
                {t("blog")}
              </Button>
            </div>
          </div> */}
          <div>
            <div className="mb-3 lg:mb-4 font-bold text-xl">
              <p className="ml-4">{t("support")}</p>
            </div>
            <div className="flex flex-col mb-4 lg:mb-0 text-sm">
              <Button variant="ghost" className="w-fit" asChild>
                <Link href="https://tally.so/r/w5MWxM" target="_blank">
                  {t("supportForm")}
                  <ExternalLink className="ml-1" />
                </Link>
              </Button>
              <Button variant="ghost" className="w-fit">
                {t("faq")}
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
