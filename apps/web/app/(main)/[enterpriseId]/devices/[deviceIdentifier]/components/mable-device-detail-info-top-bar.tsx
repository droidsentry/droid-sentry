"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronDown, MenuIcon } from "lucide-react";

import {
  FilePlusIcon,
  HistoryIcon,
  LayoutListIcon,
  MapPinnedIcon,
  SearchIcon,
  HardDriveIcon,
  ClipboardListIcon,
  ShieldCheckIcon,
  WifiHighIcon,
  KeyRoundIcon,
  FileIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SiAndroid } from "@icons-pack/react-simple-icons";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { deviceInfoNavigationItems } from "../data/navigation";

export default function MableDeviceDetailInfoTopBar({
  className,
  enterpriseId,
  deviceIdentifier,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full border-b",
        className
      )}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="m-1">
            <span className="text-sm">デバイス詳細</span>
            <ChevronDown
              size={16}
              className={cn(
                isOpen && "rotate-180",
                "transition-transform duration-300"
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <SidebarMenu className="my-2">
            {deviceInfoNavigationItems.map((navigationItems) => {
              const fullPath = `/${enterpriseId}/devices/${deviceIdentifier}/${navigationItems.url}`;
              const isActive = pathname === fullPath;

              return (
                <SidebarMenuItem key={navigationItems.label} className="px-3">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="h-10"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <Link href={fullPath}>
                      <navigationItems.icon
                        className={cn(!isActive && "text-muted-foreground")}
                      />
                      <span
                        className={cn(
                          "font-semibold pl-2",
                          !isActive && "text-muted-foreground"
                        )}
                      >
                        {navigationItems.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
