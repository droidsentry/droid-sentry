"use client";

import { ApplicationPolicy, FormPolicy, PolicyApp } from "@/app/types/policy";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import AppLibrary from "./app-library";
import AppRestrictionManager from "./app-restriction-manager";

import {
  RestrictedAppKey,
  RestrictedAppPackages,
} from "../../network/components/app-restriction";
import { useAppRestriction } from "./app-restriction-provider";
import DragAppCard from "./drag-app-card";
import DragAppsCard from "./drag-apps-card";

export default function AppRestriction({
  policyApps,
  policyIdentifier,
}: {
  policyApps: PolicyApp[];
  policyIdentifier: string;
}) {
  // ドラック中のアプリケーション
  const [activeDragApp, setActiveDragApp] = useState<PolicyApp | null>(null);
  const {
    restrictedAppPackages,
    setRestrictedAppPackages,
    appRestrictionConfigs,
    setAppRestrictionConfigs,
    selectedAppPackages,
    filteredPolicyAppStatus,
  } = useAppRestriction();
  const form = useFormContext<FormPolicy>();

  const createRestrictedAppPackages = useCallback(
    (policyApplications: ApplicationPolicy[]) => {
      const initialState: RestrictedAppPackages = {
        availableApps: [],
        restrictedApps: [],
      };
      return policyApplications.reduce((acc, policyAppSetting) => {
        const { packageName, installType } = policyAppSetting;
        if (!packageName) return acc;
        if (installType === "BLOCKED") {
          acc.restrictedApps.push(packageName);
        } else {
          acc.availableApps.push(packageName);
        }
        return acc;
      }, initialState);
    },
    []
  );

  const createRestrictedAppConfigs = useCallback(
    (policyApplications: ApplicationPolicy[]) => {
      return policyApplications
        .map((policyAppSetting) => {
          const { packageName, installType, disabled } = policyAppSetting;
          if (!packageName) return null;
          return { packageName, installType, disabled };
        })
        .filter((config) => config !== null);
    },
    []
  );

  useEffect(() => {
    const policyApplications = form.getValues("policyData.applications") ?? [];
    const restrictedApps = createRestrictedAppPackages(policyApplications);
    const restrictedConfigs = createRestrictedAppConfigs(policyApplications);
    // 初期状態の場合：フォームの値をUIに反映
    if (
      !restrictedAppPackages &&
      !appRestrictionConfigs &&
      policyApplications.length > 0
    ) {
      setRestrictedAppPackages(restrictedApps);
      setAppRestrictionConfigs(restrictedConfigs);
      return;
    }
    // UI操作による更新の場合：フォームの値を更新
    if (!appRestrictionConfigs) return;
    const hasUiChanges =
      JSON.stringify(restrictedConfigs) !==
      JSON.stringify(appRestrictionConfigs);
    if (hasUiChanges) {
      form.setValue("policyData.applications", appRestrictionConfigs, {
        shouldDirty: true, // フォームの値が変更されたかどうかを判断するためのフラグ
      });
    }
  }, [
    restrictedAppPackages,
    appRestrictionConfigs,
    form,
    createRestrictedAppPackages,
    createRestrictedAppConfigs,
    filteredPolicyAppStatus,
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
        <div className="grid grid-cols-2 gap-2 size-full my-2 px-1">
          <AppLibrary policyApps={policyApps} />
          <AppRestrictionManager policyApps={policyApps} />
        </div>
      </div>

      <DragOverlay
        dropAnimation={
          !activeDragApp && selectedAppPackages.length === 0
            ? {
                duration: 300,
              }
            : null // 選択中のアプリケーションがない場合はドラッグアニメーションを表示
        }
      >
        {activeDragApp && selectedAppPackages.length === 0 ? (
          <DragAppCard policyApp={activeDragApp} />
        ) : null}
        {activeDragApp && selectedAppPackages.length > 0 ? (
          <DragAppsCard
            policyApps={policyApps}
            selectedPolicyAppPackages={selectedAppPackages}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveDragApp(event.active.data.current as PolicyApp);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragApp(null);
    const { active, over } = event;
    if (over) {
      const overId = over.id as RestrictedAppKey;
      const activePackageName = active.id as string;
      // 複数選択されている場合はselectedPolicyAppPackagesを使用し、
      // そうでない場合はactivePackageNameを使用
      const targetPackageNames =
        selectedAppPackages.length > 0
          ? selectedAppPackages
          : [activePackageName];

      // ドラック&ドロップの場所を更新
      setRestrictedAppPackages((prev) => {
        const newRestrictedAppPackages = prev
          ? { ...prev }
          : {
              availableApps: [],
              restrictedApps: [],
            };
        // newRestrictedAppPackages(availableApps, restrictedApps)から対象のパッケージ名を削除
        Object.keys(newRestrictedAppPackages).forEach((groupId) => {
          newRestrictedAppPackages[groupId as RestrictedAppKey] =
            newRestrictedAppPackages[groupId as RestrictedAppKey].filter(
              (packageName) => !targetPackageNames.includes(packageName)
            );
        });
        // newRestrictedAppPackagesに対象のパッケージ名を追加
        newRestrictedAppPackages[overId] = [
          ...newRestrictedAppPackages[overId],
          ...targetPackageNames,
        ];
        return newRestrictedAppPackages;
      });

      // ポリシーに設定するアプリ制限の設定を更新
      setAppRestrictionConfigs((prev) => {
        let newAppRestrictionConfigs = prev ? [...prev] : [];
        // newAppRestrictionConfigsから対象のパッケージ名を削除
        newAppRestrictionConfigs = newAppRestrictionConfigs.filter(
          (config) => !targetPackageNames.includes(config.packageName)
        );
        // newAppRestrictionConfigsに対象のパッケージ名を追加
        if (overId === "availableApps") {
          targetPackageNames.forEach((packageName) => {
            newAppRestrictionConfigs.push({
              packageName,
              installType: "FORCE_INSTALLED",
              disabled: false,
            });
          });
        } else if (overId === "restrictedApps") {
          targetPackageNames.forEach((packageName) => {
            newAppRestrictionConfigs.push({
              packageName,
              installType: "BLOCKED",
              disabled: false,
            });
          });
        }

        return newAppRestrictionConfigs;
      });
    }
  }
}
