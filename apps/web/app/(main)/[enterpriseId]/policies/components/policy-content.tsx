"use client";

import { Loader2Icon } from "lucide-react";
import useSWR from "swr";
import { getPolicies } from "../data/policy";
import { PolicyTableType } from "../types/policy";
import { PoliciesTableProvider } from "./policies-table-provider";
import { policyColumns } from "./table/policies-table-columns";
import PoliciesTable from "./table/policy-table";

export default function PoliciesContent({
  data,
  enterpriseId,
}: {
  data: PolicyTableType[];
  enterpriseId: string;
}) {
  const key = `/api/policies`;
  const {
    data: policies,
    error,
    isValidating,
  } = useSWR<PolicyTableType[]>(key, () => getPolicies({ enterpriseId }), {
    suspense: true,
    fallbackData: data,
    // dedupingInterval: 3600000, // が同じ場合は1時間、関数を実行しない
    revalidateOnFocus: false, // タブ移動しても関数を実行しない
    revalidateIfStale: false, // 追加: キャッシュが古くても再検証しない ※画面のレンダリング時のデータ更新を防ぐため
    // revalidateOnMount: true, //  コンポーネントマウント時に必ず再検証
    // keepPreviousData: false, // 前のデータを保持しない
  });

  if (error) return <div>Error</div>;
  if (isValidating)
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2Icon className="animate-spin size-10 text-muted-foreground/50" />
        </div>
      </div>
    );
  if (!policies) return <div>No data</div>;

  return (
    <PoliciesTableProvider
      columns={policyColumns}
      data={policies}
      enterpriseId={enterpriseId}
    >
      <PoliciesTable columns={policyColumns} />
    </PoliciesTableProvider>
  );
}
