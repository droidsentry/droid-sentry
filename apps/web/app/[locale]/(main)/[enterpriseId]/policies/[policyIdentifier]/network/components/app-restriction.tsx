"use client";

import { ApplicationPolicy, FormPolicy, PolicyApp } from "@/app/types/policy";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import AppLibrary from "./app-library";
import AppRestrictionManager from "./app-restriction-manager";
import DragAppCard from "./drag-app-card";
import DragAppsCard from "./drag-apps-card";

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
// type RestrictedAppPackages = {
//   availableApps: string[];
//   restrictedApps: string[];
// }

// アプリケーションの詳細設定を管理する型
export type AppDetailSettings = {
  [packageName: string]: {
    installType?: InstallType;
    disabled: boolean;
  };
};

const POLICY_APP_TYPES = ["ALL", "PUBLIC", "PRIVATE", "WEB", "CUSTOM"] as const;
export type PolicyAppType = (typeof POLICY_APP_TYPES)[number];

const POLICY_APP_STATUSES = [
  "ALL",
  "UNSET",
  "FORCE_INSTALLED",
  "BLOCKED",
  "AVAILABLE",
  "DISABLED",
] as const;
export type PolicyAppStatus = (typeof POLICY_APP_STATUSES)[number];

export type UpdateAppSetting = {
  packageName: string;
  settings: Partial<{
    installType: InstallType;
    disabled: boolean;
  }>;
};

export default function AppRestriction({
  policyApps,
  policyIdentifier,
}: {
  policyApps: PolicyApp[];
  policyIdentifier: string;
}) {
  // 制御するアプリケーションのパッケージ
  const [restrictedAppPackages, setRestrictedAppPackages] =
    useState<RestrictedAppPackages | null>(null);
  // アプリケーションの詳細設定
  const [appDetailSettings, setAppDetailSettings] = useState<AppDetailSettings>(
    {}
  );

  // ドラック中のアプリケーション
  const [activePolicyApp, setActivePolicyApp] = useState<PolicyApp | null>(
    null
  );
  // 選択中のアプリケーションのパッケージ名リスト
  const [selectedPolicyAppPackages, setSelectedPolicyAppPackages] = useState<
    string[]
  >([]);
  // フィルターされたアプリケーションの種別
  const [filteredPolicyAppType, setFilteredPolicyAppType] =
    useState<PolicyAppType>("ALL");
  // フィルターされたアプリケーションのタイトル
  const [filteredPolicyAppTitle, setFilteredPolicyAppTitle] =
    useState<string>("");
  // フィルターされたアプリケーションのステータス
  const [filteredPolicyAppStatus, setFilteredPolicyAppStatus] =
    useState<PolicyAppStatus>("ALL");
  const form = useFormContext<FormPolicy>();

  // アプリケーションの詳細設定を更新する関数
  const updateAppSetting = ({ packageName, settings }: UpdateAppSetting) => {
    setAppDetailSettings((prev) => ({
      ...prev,
      [packageName]: {
        ...prev[packageName], // 既存の設定を展開
        installType: "AVAILABLE", // デフォルト値
        disabled: false, // デフォルト値
        ...settings, // 新しい設定で上書き
      },
    }));
  };

  useEffect(() => {
    // console.log("appDetailSettings", appDetailSettings);
    const policyApplications = form.getValues("policyData.applications") ?? [];
    const categorizedApps = categorizePolicyApps(
      policyApplications,
      updateAppSetting
    );

    // 初期状態の場合：フォームの値をUIに反映
    if (!restrictedAppPackages && policyApplications.length > 0) {
      setRestrictedAppPackages(categorizedApps);
      return;
    }

    // UI操作による更新の場合：フォームの値を更新
    if (!restrictedAppPackages) return;
    const hasUiChanges =
      JSON.stringify(categorizedApps) !== JSON.stringify(restrictedAppPackages);
    // console.log("hasUiChanges", hasUiChanges);
    // console.log("appDetailSettings2", appDetailSettings);
    if (hasUiChanges) {
      const policyAppSettings = createPolicyAppSettings(
        restrictedAppPackages,
        policyApps,
        appDetailSettings
      );
      console.log(
        "policyAppSettings",
        policyAppSettings.filter((app) => app.installType === "BLOCKED")
      );
      form.setValue("policyData.applications", policyAppSettings, {
        shouldDirty: true, // フォームの値が変更されたかどうかを判断するためのフラグ
      });
    }
  }, [
    form,
    restrictedAppPackages,
    policyApps,
    // updateAppSetting,
    // setRestrictedAppPackages,
    // appDetailSettings,
  ]);

  const isLoading =
    policyIdentifier !== "new" && // 新規作成時はローディングチェックをスキップ
    !form.formState.isDirty && // フォームが一度も編集されていない
    !form.getValues("policyDisplayName");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      id={"custom-id-for-dnd-context"} //https://github.com/clauderic/dnd-kit/issues/926
    >
      <div className="flex items-center justify-center h-full">
        <div className="grid grid-cols-2 gap-4 size-full mx-20 py-11">
          <AppLibrary
            policyApps={policyApps}
            restrictedAppPackages={restrictedAppPackages}
            setRestrictedAppPackages={setRestrictedAppPackages}
            selectedPolicyAppPackages={selectedPolicyAppPackages}
            setSelectedPolicyAppPackages={setSelectedPolicyAppPackages}
            filteredPolicyAppType={filteredPolicyAppType}
            setFilteredPolicyAppType={setFilteredPolicyAppType}
            filteredPolicyAppTitle={filteredPolicyAppTitle}
            setFilteredPolicyAppTitle={setFilteredPolicyAppTitle}
            filteredPolicyAppStatus={filteredPolicyAppStatus}
            setFilteredPolicyAppStatus={setFilteredPolicyAppStatus}
          />
          <AppRestrictionManager
            policyApps={policyApps}
            restrictedAppPackages={restrictedAppPackages}
            setRestrictedAppPackages={setRestrictedAppPackages}
            setAppDetailSettings={setAppDetailSettings}
          />
        </div>
      </div>

      <DragOverlay
        dropAnimation={
          !activePolicyApp && selectedPolicyAppPackages.length === 0
            ? {
                duration: 300,
              }
            : null
        }
      >
        {activePolicyApp && selectedPolicyAppPackages.length === 0 ? (
          <DragAppCard policyApp={activePolicyApp} />
        ) : null}
        {activePolicyApp && selectedPolicyAppPackages.length > 0 ? (
          <DragAppsCard
            policyApps={policyApps}
            selectedPolicyAppPackages={selectedPolicyAppPackages}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function handleDragStart(event: DragStartEvent) {
    setActivePolicyApp(event.active.data.current as PolicyApp);
  }

  function handleDragEnd(event: DragEndEvent) {
    // console.log("appDetailSettings3", appDetailSettings);
    setActivePolicyApp(null);
    const { active, over } = event;
    if (over) {
      const overId = over.id as keyof RestrictedAppPackages;
      const activePackageName = active.id as string;

      // 複数選択されている場合はselectedPolicyAppPackagesを使用し、
      // そうでない場合はactivePackageNameを使用
      const targetPackageNames =
        selectedPolicyAppPackages.length > 0
          ? selectedPolicyAppPackages
          : [activePackageName];

      setRestrictedAppPackages((prev) => {
        // if (prev) return null;
        // 新しい状態のオブジェクトを作成
        const newState = prev
          ? { ...prev }
          : {
              availableApps: [],
              restrictedApps: [],
            };

        // 全てのグループから対象のパッケージ名を削除
        Object.keys(newState).forEach((groupId) => {
          newState[groupId as RestrictedAppKey] = newState[
            groupId as RestrictedAppKey
          ].filter((packageName) => !targetPackageNames.includes(packageName));
        });
        targetPackageNames.forEach((packageName) => {
          if (overId === "availableApps") {
            updateAppSetting({
              packageName,
              settings: { installType: "FORCE_INSTALLED" },
            });
          } else {
            updateAppSetting({
              packageName,
              settings: { installType: "BLOCKED" },
            });
          }
        });
        // 新しいグループに対象のパッケージ名を追加
        newState[overId] = [...newState[overId], ...targetPackageNames];
        return newState;
      });
    }
  }
}

/**
 * アプリケーションを種別ごとに分類する関数。
 * フォームの値からアプリケーション設定を分類するために使用する。
 * @param policyAppSettings アプリケーション設定のリスト
 * @param updateAppSetting アプリケーションの詳細設定を更新する関数
 * @returns 制御するアプリケーションのパッケージ
 */
const categorizePolicyApps = (
  policyAppSettings: ApplicationPolicy[],
  updateAppSetting: (updateAppSetting: UpdateAppSetting) => void
): RestrictedAppPackages => {
  const initialState: RestrictedAppPackages = {
    availableApps: [],
    restrictedApps: [],
  };

  return policyAppSettings.reduce((acc, policyAppSetting) => {
    const { packageName, installType, disabled } = policyAppSetting;
    if (!packageName) return acc;

    switch (installType) {
      case "PREINSTALLED":
        acc.availableApps.push(packageName);
        updateAppSetting({
          packageName,
          settings: { installType: "PREINSTALLED" },
        });
        break;
      case "FORCE_INSTALLED":
        acc.availableApps.push(packageName);
        updateAppSetting({
          packageName,
          settings: { installType: "FORCE_INSTALLED" },
        });
        break;
      case "BLOCKED":
        acc.restrictedApps.push(packageName);
        updateAppSetting({
          packageName,
          settings: { installType: "BLOCKED" },
        });
        break;
      case "AVAILABLE":
        acc.availableApps.push(packageName);
        updateAppSetting({
          packageName,
          settings: { installType: "AVAILABLE" },
        });
        break;
      case "KIOSK":
        acc.availableApps.push(packageName);
        updateAppSetting({
          packageName,
          settings: { installType: "KIOSK" },
        });
        break;
      default:
        if (disabled) {
          acc.availableApps.push(packageName);
          updateAppSetting({
            packageName,
            settings: { disabled: true },
          });
        }
    }

    return acc;
  }, initialState);
};

// 関数のパラメータ用の型
type CreatePolicyAppSettingParams = {
  policyApps: PolicyApp[];
  packageName: string;
  appDetailSettings: AppDetailSettings;
  // installType?: string;
  // disabled?: boolean;
};

// 関数の戻り値用の型
type PolicyAppSetting = {
  packageName: string;
  installType?: string;
  disabled: boolean;
};

/**
 * アプリケーション設定を生成する関数
 * @param policyApps アプリケーションのリスト
 * @param packageName アプリケーションのパッケージ名
 * @param installType インストールタイプ
 * @param disabled 無効化フラグ
 * @returns アプリケーション設定
 */
const createPolicyAppSetting = ({
  policyApps,
  packageName,
  appDetailSettings,
  // installType,
  // disabled = false,
}: CreatePolicyAppSettingParams): PolicyAppSetting | null => {
  const policyApp = policyApps.find((app) => app.packageName === packageName);
  const installType = appDetailSettings[packageName]?.installType;
  const disabled = appDetailSettings[packageName]?.disabled;

  if (!policyApp) {
    console.warn(`Policy app not found for package: ${packageName}`);
    return null;
  }

  return {
    packageName: policyApp.packageName,
    ...(installType && { installType }),
    disabled,
  };
};

/**
 * アプリケーション設定を生成する関数。
 * フォームの値を更新するために使用する。
 * @param restrictedAppPackages 制御するアプリケーションのパッケージ
 * @param policyApps アプリケーションのリスト
 * @returns アプリケーション設定のリスト
 */
const createPolicyAppSettings = (
  restrictedAppPackages: RestrictedAppPackages,
  policyApps: PolicyApp[],
  appDetailSettings: AppDetailSettings
): PolicyAppSetting[] => {
  // 利用可能なアプリ
  const availableAppSettings = restrictedAppPackages.availableApps.map(
    (packageName) =>
      createPolicyAppSetting({
        policyApps,
        packageName,
        appDetailSettings,
        // installType: "FORCE_INSTALLED",
        // disabled: false,
      })
  );
  // 制限するアプリ
  const restrictedAppSettings = restrictedAppPackages.restrictedApps.map(
    (packageName) =>
      createPolicyAppSetting({
        policyApps,
        packageName,
        appDetailSettings,
        // installType: "BLOCKED",
        // disabled: false,
      })
  );
  // // 無効化するアプリ
  // const disabledAppSettings = restrictedAppPackages.disabledApps.map(
  //   (packageName) =>
  //     createPolicyAppSetting({
  //       policyApps,
  //       packageName,
  //       disabled: true,
  //     })
  // );

  const policyAppSettings = [
    ...availableAppSettings,
    ...restrictedAppSettings,
    // ...disabledAppSettings,
  ].filter((setting): setting is PolicyAppSetting => setting !== null);

  return policyAppSettings;
};
