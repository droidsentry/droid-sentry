"use client";

import { FileSlidersIcon, LayoutListIcon } from "lucide-react";

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
import { useParams, usePathname } from "next/navigation";
import { appTypeItems } from "../data/app-type";

export function AppsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const param = useParams<{ enterpriseId: string }>();
  const enterpriseId = param.enterpriseId;

  // 管理アプリ一覧のパス
  const appListPath = `/${enterpriseId}/apps`;
  const isAppListActive = pathname === appListPath;

  // 管理アプリ構成のパス
  const appConfigPath = `/${enterpriseId}/apps/configurations`;
  const isAppConfigActive = pathname === appConfigPath;

  return (
    <Sidebar
      className={cn("inset-x-14", className)}
      // collapsible="icon"
    >
      {/* // <Sidebar variant="inset"> */}
      <SidebarHeader className="border-b flex min-h-12 px-6">
        <SidebarContent>
          <h4 className="text-lg font-bold">アプリ管理</h4>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="px-3 pt-2">
                <SidebarMenuButton asChild isActive={isAppListActive}>
                  <Link href={appListPath}>
                    <LayoutListIcon
                      className={cn(
                        !isAppListActive && "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "font-semibold pl-2",
                        !isAppListActive && "text-muted-foreground"
                      )}
                    >
                      管理アプリ一覧
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-mono">
            管理アプリ種別
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appTypeItems.map((item) => {
                const fullPath = `/${enterpriseId}${item.url}`;
                const isActive = pathname === fullPath;

                return (
                  <SidebarMenuItem key={item.title} className="px-3">
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={fullPath}>
                        <item.icon
                          className={cn(!isActive && "text-muted-foreground")}
                        />
                        <span
                          className={cn(
                            "font-semibold pl-2",
                            !isActive && "text-muted-foreground"
                          )}
                        >
                          {item.title}
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
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="px-3">
                <SidebarMenuButton asChild isActive={isAppConfigActive}>
                  <Link href={appConfigPath}>
                    <FileSlidersIcon
                      className={cn(
                        !isAppConfigActive && "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "font-semibold pl-2",
                        !isAppConfigActive && "text-muted-foreground"
                      )}
                    >
                      管理アプリ構成
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
