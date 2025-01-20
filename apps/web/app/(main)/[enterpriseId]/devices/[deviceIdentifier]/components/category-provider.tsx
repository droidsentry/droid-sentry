"use client";

import { RouteParams } from "@/app/types/enterprise";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, createContext, useContext } from "react";

type ContextType = {
  enterpriseId: string;
  deviceIdentifier: string;
  category: string;
};

const Context = createContext<ContextType>({} as ContextType);

export function CategoryProvider({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;
  const deviceIdentifier = params.deviceIdentifier;
  const category = params.category;

  return (
    <Context.Provider value={{ enterpriseId, deviceIdentifier, category }}>
      <Tabs defaultValue={category} className={cn("w-[400px]", className)}>
        <TabsList className="mt-1.5 ml-2 ">
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
        {children}
      </Tabs>
    </Context.Provider>
  );
}

export const useCategoryProvider = () => useContext(Context);
