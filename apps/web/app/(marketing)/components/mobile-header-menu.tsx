import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import Link from "next/link";
import SingInButton from "./sign-in-button";

export default function MobileHeaderMenu() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="size-12" size="icon">
          <Menu className="size-10" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85dvh] p-2">
        <DrawerTitle className="sr-only">メニュー</DrawerTitle>
        <div className="flex flex-col gap-2 mt-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/features" replace>
              <span className="text-lg">ご利用の流れ</span>
            </Link>
          </Button>
          <Separator />
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/features" replace>
              <span className="text-lg">プラン</span>
            </Link>
          </Button>
          <Separator />
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/features" replace>
              <span className="text-lg">ブログ</span>
            </Link>
          </Button>
          <Separator />
          <Button
            className="text-16 rounded-full text-center w-full h-[52px] px-6 py-4 md:w-auto"
            asChild
          >
            <Link href="/features" replace>
              <span className="text-base">無料アカウントで始める</span>
            </Link>
          </Button>
          <SingInButton className="w-full ml-0" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
