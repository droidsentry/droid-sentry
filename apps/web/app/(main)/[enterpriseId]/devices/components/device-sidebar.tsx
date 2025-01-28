"use client";

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
import { SiAndroid } from "@icons-pack/react-simple-icons";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { RouteParams } from "@/app/types/enterprise";
import { useEffect } from "react";

export function DeviceSidebar({
  className,
  enterpriseId,
}: {
  className?: string;
  enterpriseId: string;
}) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const params = useParams<RouteParams>();
  const deviceIdentifier = params.deviceIdentifier;

  useEffect(() => {
    console.log("deviceIdentifier", deviceIdentifier);
  }, [params]);

  return (
    <Sidebar className={cn("inset-x-14", className)}>
      <SidebarHeader className="border-b flex min-h-12 px-6">
        <SidebarContent>
          <h4 className="text-lg font-bold">デバイス</h4>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-mono">
            デバイス一覧
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {deviceListItems.map((deviceListItems) => {
                const fullPath = `/${enterpriseId}${deviceListItems.url}`;
                const isActive = pathname === fullPath;

                return (
                  <SidebarMenuItem key={deviceListItems.title} className="px-3">
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={fullPath}>
                        <deviceListItems.icon
                          className={cn(!isActive && "text-muted-foreground")}
                        />
                        <span
                          className={cn(
                            "font-semibold pl-2",
                            !isActive && "text-muted-foreground"
                          )}
                        >
                          {deviceListItems.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-mono">
            紛失モード
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {lostModeItems.map((lostModeItems) => {
                const fullPath = `/${enterpriseId}${lostModeItems.url}`;
                const isActive = pathname === fullPath;

                return (
                  <SidebarMenuItem key={lostModeItems.title} className="px-3">
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={fullPath}>
                        <lostModeItems.icon
                          className={cn(!isActive && "text-muted-foreground")}
                        />
                        <span
                          className={cn(
                            "font-semibold pl-2",
                            !isActive && "text-muted-foreground"
                          )}
                        >
                          {lostModeItems.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-mono">
            ゼロタッチ
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {zeroTouchItems.map((zeroTouchItems) => {
                const fullPath = `/${enterpriseId}${zeroTouchItems.url}`;
                const isActive = pathname === fullPath;

                return (
                  <SidebarMenuItem key={zeroTouchItems.title} className="px-3">
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={fullPath}>
                        <zeroTouchItems.icon
                          className={cn(!isActive && "text-muted-foreground")}
                        />
                        <span
                          className={cn(
                            "font-semibold pl-2",
                            !isActive && "text-muted-foreground"
                          )}
                        >
                          {zeroTouchItems.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />

        <SidebarGroup className={cn(!isMobile && "hidden")}>
          <SidebarGroupLabel className="px-3 font-mono">
            デバイス詳細
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((navigationItems) => {
                const fullPath = `/${enterpriseId}/devices/${deviceIdentifier}${navigationItems.url}`;
                const isActive = pathname === fullPath;
                console.log("fullPath", fullPath);
                console.log("pathname", pathname);
                console.log("isActive", isActive);

                return (
                  <SidebarMenuItem key={navigationItems.title} className="px-3">
                    <SidebarMenuButton asChild isActive={isActive}>
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
                          {navigationItems.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className={cn(!isMobile && "hidden")} />
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}

// Menu items.
const deviceListItems = [
  {
    title: "リスト",
    url: "/devices",
    icon: LayoutListIcon,
  },
  {
    title: "詳細検索",
    url: "/policies/search",
    icon: SearchIcon,
  },
  {
    title: "履歴",
    url: "/policies/history",
    icon: HistoryIcon,
  },
  {
    title: "作成ログ",
    url: "/policies/create-log",
    icon: FilePlusIcon,
  },
];
// 紛失モード
const lostModeItems = [
  {
    title: "位置情報",
    url: "/devices/lost-mode/location",
    icon: MapPinnedIcon,
  },
  {
    title: "イベントログ",
    url: "/devices/lost-mode/event-log",
    icon: HistoryIcon,
  },
];

// ゼロタッチ
const zeroTouchItems = [
  {
    title: "手動設定",
    url: "/devices/zero-touch/manual-setup",
    icon: FilePlusIcon,
  },
  {
    title: "自動設定",
    url: "/devices/zero-touch/auto-setup",
    icon: FilePlusIcon,
  },
];

// デバイス詳細
export const navigationItems = [
  {
    icon: HardDriveIcon,
    title: "ハードウェア情報",
    url: "/hardware",
  },
  {
    icon: ClipboardListIcon,
    title: "ソフトウェア情報",
    url: "/software",
  },
  {
    icon: SiAndroid,
    title: "アプリケーションレポート",
    url: "/application",
  },
  {
    icon: ShieldCheckIcon,
    title: "ポリシー情報",
    url: "/policy",
  },
  {
    icon: WifiHighIcon,
    title: "ネットワーク情報",
    url: "/network",
  },
  {
    icon: KeyRoundIcon,
    title: "セキュリティ情報",
    url: "/security",
  },
  {
    icon: FileIcon,
    title: "ログ",
    url: "/log",
  },
];
