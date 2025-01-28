import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CategoryTopBar({
  enterpriseId,
  deviceIdentifier,
  className,
  category,
}: {
  enterpriseId: string;
  deviceIdentifier: string;
  className?: string;
  category: string;
}) {
  return (
    <Tabs defaultValue={category} className={cn("", className)}>
      <TabsList className="m-1 ">
        <TabsTrigger value="hardware">
          <Link href={`/${enterpriseId}/devices/${deviceIdentifier}/hardware`}>
            ハードウェア情報
          </Link>
        </TabsTrigger>
        <TabsTrigger value="software">
          <Link href={`/${enterpriseId}/devices/${deviceIdentifier}/software`}>
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
          <Link href={`/${enterpriseId}/devices/${deviceIdentifier}/security`}>
            セキュリティ情報
          </Link>
        </TabsTrigger>
        <TabsTrigger value="log">
          <Link href={`/${enterpriseId}/devices/${deviceIdentifier}/log`}>
            ログ
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
