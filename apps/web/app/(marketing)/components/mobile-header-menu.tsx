import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import Link from "next/link";
import { LocaleToggle } from "./locale-toggle";
import SingInButton from "./sign-in-button";
import StartFreeAccountButton from "./start-free-account-button";
import { getTranslations } from "next-intl/server";

export default async function MobileHeaderMenu() {
  const t = await getTranslations("marketing.header");
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="size-12" size="icon">
          <Menu className="size-10" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85dvh] p-2">
        <DrawerTitle className="sr-only">{t("drawerTitle")}</DrawerTitle>
        <div className="flex flex-col gap-2 mt-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/" replace>
              <span className="text-lg">{t("flowOfUse")}</span>
            </Link>
          </Button>
          <Separator />
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/" replace>
              <span className="text-lg">{t("plan")}</span>
            </Link>
          </Button>
          <Separator />
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/" replace>
              <span className="text-lg">{t("blog")}</span>
            </Link>
          </Button>
          <Separator />

          <StartFreeAccountButton className="w-full ml-0" />
          <SingInButton className="w-full ml-0" />
          <LocaleToggle className="w-fit" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
