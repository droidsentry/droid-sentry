"use client";

import { LucideIcon } from "lucide-react";

import { RouteParams } from "@/app/types/enterprise";
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
import { useParams, usePathname, useSearchParams } from "next/navigation";
import {
  policyDetailItems,
  policyListItems,
  scheduleDeliveryItems,
} from "../data/side-bar-menu-list";

/**
 * ポリシー一覧用のURL生成を作成するヘルパー関数
 * @param base ベースのURL
 * @param path パス
 * @param searchPolicyId 検索パラメーターのpolicyId
 * @returns ポリシーのURL
 */
function createPolicyListUrl(
  base: string,
  path: string,
  policyIdentifier: string | null
) {
  // pathが空文字の場合は、baseをそのまま返す
  const url = !path ? base : `${base}/${path}`;
  // return url;
  return policyIdentifier !== "new" ? `${url}?id=${policyIdentifier}` : url;
}

/**
 * サイドバーのメニューアイテムコンポーネント
 * @param href リンク先のURL
 * @param icon アイコン
 * @param title タイトル
 * @returns サイドバーのメニューアイテム
 */
function SidebarMenuItemLink({
  href,
  icon: Icon,
  title,
  searchPolicyId,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  searchPolicyId?: string | null;
}) {
  const pathname = usePathname();
  const isActive =
    pathname ===
    (searchPolicyId ? href.split(`?policyId=${searchPolicyId}`)[0] : href);
  return (
    <SidebarMenuItem className="px-3">
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={href}>
          <Icon className={cn(!isActive && "text-muted-foreground")} />
          <span
            className={cn(
              "font-semibold pl-2",
              !isActive && "text-muted-foreground"
            )}
          >
            {title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * ポリシーのサイドバーコンポーネント
 * @param className クラス名
 * @returns ポリシーのサイドバー
 */
export function PolicySidebar({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const searchPolicyIdentifier = searchParams.get("id");
  const param = useParams<RouteParams>();
  const policyIdentifier = searchPolicyIdentifier ?? param.policyId ?? "new";
  const enterpriseId = param.enterpriseId;
  const policyListPath = `/${enterpriseId}/policies`;
  const policyBasePath = `/${enterpriseId}/policies/${policyIdentifier}`;

  return (
    <Sidebar className={cn("inset-x-14", className)}>
      <SidebarHeader className="border-b flex min-h-12 px-6">
        <SidebarContent>
          <h4 className="text-lg font-bold">ポリシー</h4>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-mono">
            ポリシー一覧
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {policyListItems.map((item) => (
                <SidebarMenuItemLink
                  key={item.title}
                  href={createPolicyListUrl(
                    policyListPath, // ベースのURL
                    item.url, // パス
                    policyIdentifier // 検索パラメーターのpolicyId
                  )}
                  icon={item.icon} // アイコン
                  title={item.title} // タイトル
                  searchPolicyId={searchPolicyIdentifier}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-mono">
            ポリシー詳細
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {policyDetailItems.map((item) => (
                <SidebarMenuItemLink
                  key={item.title}
                  href={`${policyBasePath}/${item.url}`}
                  icon={item.icon} // アイコン
                  title={item.title} // タイトル
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-mono">
            スケジュール配信
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {scheduleDeliveryItems.map((item) => (
                <SidebarMenuItemLink
                  key={item.title}
                  href={`${policyBasePath}/${item.url}`}
                  icon={item.icon} // アイコン
                  title={item.title} // タイトル
                />
              ))}
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
