"use client";

import { ReactNode, createContext, useContext, useState } from "react";
// インストールタイプの定数定義
const INSTALL_TYPES = [
  "PREINSTALLED",
  "FORCE_INSTALLED",
  "BLOCKED",
  "AVAILABLE",
  "REQUIRED_FOR_SETUP",
  "KIOSK",
] as const;
export type InstallType = (typeof INSTALL_TYPES)[number];
// ドラッグ&ドロップで使用する制限タイプ
const RESTRICTED_APP_KEYS = ["availableApps", "restrictedApps"] as const;
export type RestrictedAppKey = (typeof RESTRICTED_APP_KEYS)[number];
export type RestrictedAppPackages = {
  [K in RestrictedAppKey]: string[];
};
export type AppRestrictionConfig = {
  packageName: string;
  installType?: string | null;
  disabled?: boolean | null;
};

const POLICY_APP_TYPES = ["ALL", "PUBLIC", "PRIVATE", "WEB", "CUSTOM"] as const;
export type PolicyAppType = (typeof POLICY_APP_TYPES)[number];

const POLICY_APP_STATUSES = [
  "ALL", // 全て
  "PREINSTALLED", // 自動インストール(手動削除可)
  "FORCE_INSTALLED", // 強制インストール(手動削除不可)
  "BLOCKED", // インストール制限(強制アンインストール)
  "AVAILABLE", // 利用可能(手動削除可)
  "KIOSK", // キオスクモード(手動削除不可)
  "DISABLED", // アプリ無効(アプリデータは保持)
] as const;
export type PolicyAppStatus = (typeof POLICY_APP_STATUSES)[number];

export type UpdateAppSetting = {
  packageName: string;
  settings: Partial<{
    installType: InstallType;
    disabled: boolean;
  }>;
};

type ContextType = {
  restrictedAppPackages: RestrictedAppPackages | null;
  setRestrictedAppPackages: React.Dispatch<
    React.SetStateAction<RestrictedAppPackages | null>
  >;
  appRestrictionConfigs: AppRestrictionConfig[] | null;
  setAppRestrictionConfigs: React.Dispatch<
    React.SetStateAction<AppRestrictionConfig[] | null>
  >;
  selectedAppPackages: string[];
  setSelectedAppPackages: React.Dispatch<React.SetStateAction<string[]>>;
  filteredPolicyAppType: PolicyAppType;
  setFilteredPolicyAppType: React.Dispatch<React.SetStateAction<PolicyAppType>>;
  filteredPolicyAppTitle: string;
  setFilteredPolicyAppTitle: React.Dispatch<React.SetStateAction<string>>;
  filteredPolicyAppStatus: PolicyAppStatus;
  setFilteredPolicyAppStatus: React.Dispatch<
    React.SetStateAction<PolicyAppStatus>
  >;
};

const Context = createContext<ContextType>({} as ContextType);

export function AppRestrictionProvider({ children }: { children: ReactNode }) {
  // ドラック＆ドロップの場所を管理
  const [restrictedAppPackages, setRestrictedAppPackages] =
    useState<RestrictedAppPackages | null>(null);
  // ポリシーに設定するアプリ制限の設定を管理
  const [appRestrictionConfigs, setAppRestrictionConfigs] = useState<
    AppRestrictionConfig[] | null
  >(null);
  // 選択中のアプリケーションのパッケージ名のリストを管理
  const [selectedAppPackages, setSelectedAppPackages] = useState<string[]>([]);
  // フィルターされたアプリケーションの種別を管理
  const [filteredPolicyAppType, setFilteredPolicyAppType] =
    useState<PolicyAppType>("ALL");
  // フィルターされたアプリケーションのタイトルを管理
  const [filteredPolicyAppTitle, setFilteredPolicyAppTitle] =
    useState<string>("");
  // フィルターされたアプリケーションのステータスを管理
  const [filteredPolicyAppStatus, setFilteredPolicyAppStatus] =
    useState<PolicyAppStatus>("ALL");

  return (
    <Context.Provider
      value={{
        restrictedAppPackages,
        setRestrictedAppPackages,
        appRestrictionConfigs,
        setAppRestrictionConfigs,
        selectedAppPackages,
        setSelectedAppPackages,
        filteredPolicyAppType,
        setFilteredPolicyAppType,
        filteredPolicyAppTitle,
        setFilteredPolicyAppTitle,
        filteredPolicyAppStatus,
        setFilteredPolicyAppStatus,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useAppRestriction = () => useContext(Context);
