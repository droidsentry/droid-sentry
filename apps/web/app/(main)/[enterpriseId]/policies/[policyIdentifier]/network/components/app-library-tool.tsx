import { PolicyApp } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { PolicyAppStatus, PolicyAppType } from "./app-restriction";

export default function AppLibraryTool({
  filteredPolicyApps,
  selectedPolicyAppPackages,
  setSelectedPolicyAppPackages,
  filteredPolicyAppType,
  setFilteredPolicyAppType,
  filteredPolicyAppTitle,
  setFilteredPolicyAppTitle,
  filteredPolicyAppStatus,
  setFilteredPolicyAppStatus,
}: {
  filteredPolicyApps: PolicyApp[];
  selectedPolicyAppPackages: string[];
  setSelectedPolicyAppPackages: React.Dispatch<React.SetStateAction<string[]>>;
  filteredPolicyAppType: PolicyAppType;
  setFilteredPolicyAppType: React.Dispatch<React.SetStateAction<PolicyAppType>>;
  filteredPolicyAppTitle: string;
  setFilteredPolicyAppTitle: React.Dispatch<React.SetStateAction<string>>;
  filteredPolicyAppStatus: PolicyAppStatus;
  setFilteredPolicyAppStatus: React.Dispatch<
    React.SetStateAction<PolicyAppStatus>
  >;
}) {
  const appsCount = selectedPolicyAppPackages.length;
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSelect, setISelect] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    setSelectedPolicyAppPackages([]);

    // 1回転（360度）の時間を1秒に設定
    setTimeout(() => {
      setIsSpinning(false);
    }, 1600);
  };

  const handleSelectAll = () => {
    if (!isSelect) {
      // 既存の選択に新しい項目を追加（重複を除去）
      const newSelectedPackages = [
        ...new Set([
          ...selectedPolicyAppPackages,
          ...filteredPolicyApps.map((app) => app.packageName),
        ]),
      ];
      setSelectedPolicyAppPackages(newSelectedPackages);
    } else {
      // フィルターされたアプリのpackageNameを除外
      const resetSelectedPackages = selectedPolicyAppPackages.filter(
        (packageName) =>
          !filteredPolicyApps.some((app) => app.packageName === packageName)
      );
      setSelectedPolicyAppPackages(resetSelectedPackages);
    }
    setISelect(!isSelect);
  };

  return (
    <div className="basis-1/4 m-2 border rounded-lg">
      <h2 className="text-2xl font-bold">アプリケーション一覧</h2>
      <Input
        type="text"
        placeholder="アプリケーション名を検索"
        className="mb-2"
        value={filteredPolicyAppTitle}
        onChange={(e) => setFilteredPolicyAppTitle(e.target.value)}
      />
      <div className="grid grid-cols-3 gap-2">
        <Select
          defaultValue="ALL"
          value={filteredPolicyAppType}
          onValueChange={(value) => {
            setFilteredPolicyAppType(value as PolicyAppType);
            setISelect(false);
          }}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="アプリ種別" />
          </SelectTrigger>
          <SelectContent className=" text-center justify-center items-center flex flex-col">
            <SelectItem value="ALL">全てのアプリ種類</SelectItem>
            <SelectItem value="PUBLIC">Google Play</SelectItem>
            <SelectItem value="PRIVATE">限定公開</SelectItem>
            <SelectItem value="WEB">WEB</SelectItem>
            <SelectItem value="CUSTOM">カスタム</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filteredPolicyAppStatus}
          onValueChange={(value) => {
            setFilteredPolicyAppStatus(value as PolicyAppStatus);
            setISelect(false);
          }}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全てのステータス</SelectItem>
            <SelectItem value="UNSET">未設定</SelectItem>
            <SelectItem value="FORCE_INSTALLED">
              利用可能(自動インストール)
            </SelectItem>
            <SelectItem value="BLOCKED">インストール不可</SelectItem>
            <SelectItem value="AVAILABLE">
              利用可能(手動インストール)
            </SelectItem>
            <SelectItem value="disabled">アプリ無効</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className=""
          onClick={() => {
            handleRefresh();
            setFilteredPolicyAppTitle("");
            setSelectedPolicyAppPackages([]);
          }}
        >
          <RefreshCw
            className={cn(
              "size-4",
              "transition-transform duration-500",
              isSpinning ? "[animation:spin_1.5s_linear]" : ""
            )}
          />
          {appsCount > 0 && (
            <span className="text-lg font-bold text-primary items-center justify-center rounded-md shrink-0 ">
              +{appsCount}
            </span>
          )}
        </Button>

        <Button variant="outline" className="" onClick={handleSelectAll}>
          <span className="text-lg font-bold text-primary items-center justify-center rounded-md shrink-0 tracking-widest">
            {isSelect ? "全選択解除" : "全選択"}
          </span>
        </Button>
      </div>
    </div>
  );
}
