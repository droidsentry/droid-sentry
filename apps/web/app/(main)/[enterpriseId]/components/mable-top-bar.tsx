import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DeviceInfoNavigationMenu from "../devices/[deviceIdentifier]/components/device-info-navigation-menu";

export default function MableTopBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full border-b",
        className
      )}
    >
      <SidebarTrigger variant="ghost" className="size-10 m-1" />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="size-10 m-1">
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="mb-20">
          <SheetHeader className="m-4">
            <SheetTitle>デバイス詳細</SheetTitle>
          </SheetHeader>
          <DeviceInfoNavigationMenu />
        </SheetContent>
      </Sheet>
    </div>
  );
}
