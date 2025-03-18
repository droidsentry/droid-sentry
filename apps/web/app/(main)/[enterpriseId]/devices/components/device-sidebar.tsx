"use client";

import {
  FilePlusIcon,
  HistoryIcon,
  LayoutListIcon,
  MapPinnedIcon,
  SearchIcon,
} from "lucide-react";

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
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DeviceSidebar({
  className,
  enterpriseId,
}: {
  className?: string;
  enterpriseId: string;
}) {
  const pathname = usePathname();

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
              <SidebarMenuItem className="px-3">
                <SidebarMenuButton asChild disabled>
                  <div className="flex items-center">
                    <SearchIcon className="text-muted-foreground" />
                    <span
                      className={cn("font-semibold pl-2 text-muted-foreground")}
                    >
                      {"詳細検索 (近日リリース)"}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="px-3">
                <SidebarMenuButton asChild disabled>
                  <div className="flex items-center">
                    <HistoryIcon className="text-muted-foreground" />
                    <span
                      className={cn("font-semibold pl-2 text-muted-foreground")}
                    >
                      {"ログ一覧 (近日リリース)"}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                    <SidebarMenuButton asChild isActive={isActive} disabled>
                      {/* <Link href={fullPath}> */}
                      <div className="flex items-center">
                        <lostModeItems.icon
                          className={cn(!isActive && "text-muted-foreground")}
                        />
                        <span
                          className={cn(
                            "font-semibold pl-2",
                            !isActive && "text-muted-foreground"
                          )}
                        >
                          {lostModeItems.title} (近日リリース)
                        </span>
                        {/* </Link> */}
                      </div>
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
                    <SidebarMenuButton asChild isActive={isActive} disabled>
                      {/* <Link href={fullPath}> */}
                      <div className="flex items-center">
                        <zeroTouchItems.icon
                          className={cn(!isActive && "text-muted-foreground")}
                        />
                        <span
                          className={cn(
                            "font-semibold pl-2",
                            !isActive && "text-muted-foreground"
                          )}
                        >
                          {zeroTouchItems.title} (近日リリース)
                        </span>
                        {/* </Link> */}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
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
  // {
  //   title: "詳細検索",
  //   url: "/policies/search",
  //   icon: SearchIcon,
  // },
  // {
  //   title: "履歴",
  //   url: "/policies/history",
  //   icon: HistoryIcon,
  // },
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
