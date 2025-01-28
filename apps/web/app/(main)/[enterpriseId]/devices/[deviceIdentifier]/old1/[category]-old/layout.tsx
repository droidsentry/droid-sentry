import { RouteParams } from "@/app/types/enterprise";
import CategoryTopBar from "../../components/category-top-bar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2Icon } from "lucide-react";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier, category } = await params;
  return (
    <div className="flex flex-col h-full">
      {/* <CategoryTopBar
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
        category={category}
      ></CategoryTopBar>
      <div className="flex-1 min-h-0 min-w-0">{children}</div> */}
      <Tabs defaultValue={category} className={cn("flex flex-col h-full")}>
        <TabsList className="m-1 w-fit hidden lg:block">
          <TabsTrigger value="hardware">
            <Link
              href={`/${enterpriseId}/devices/${deviceIdentifier}/hardware`}
            >
              ハードウェア情報
            </Link>
          </TabsTrigger>
          <TabsTrigger value="software">
            <Link
              href={`/${enterpriseId}/devices/${deviceIdentifier}/software`}
            >
              ソフトウェア情報
            </Link>
          </TabsTrigger>
          <TabsTrigger value="application">
            <Link
              href={`/${enterpriseId}/devices/${deviceIdentifier}/application`}
            >
              アプリケーションレポート
            </Link>
          </TabsTrigger>
          <TabsTrigger value="policy">
            <Link href={`/${enterpriseId}/devices/${deviceIdentifier}/policy`}>
              ポリシー情報
            </Link>
          </TabsTrigger>
          <TabsTrigger value="network">
            <Link href={`/${enterpriseId}/devices/${deviceIdentifier}/network`}>
              ネットワーク情報
            </Link>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Link
              href={`/${enterpriseId}/devices/${deviceIdentifier}/security`}
            >
              セキュリティ情報
            </Link>
          </TabsTrigger>
          <TabsTrigger value="log">
            <Link href={`/${enterpriseId}/devices/${deviceIdentifier}/log`}>
              ログ
            </Link>
          </TabsTrigger>
        </TabsList>
        <div className="lg:hidden m-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${enterpriseId}/devices/${deviceIdentifier}`}>
              <Undo2Icon className="hover:text-primary transition-all duration-300" />
            </Link>
          </Button>
        </div>
        <div className="flex-1">{children}</div>
      </Tabs>
    </div>
  );
}
