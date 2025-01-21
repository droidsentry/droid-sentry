"use client";

import { Apps, FormPolicy, PolicyApp } from "@/app/types/policy";
import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import AppManagement from "./app-management";
import ApplicationLibrary from "./application-library";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AppContent({ appsData }: { appsData: PolicyApp[] }) {
  const [apps, setApps] = useState<Apps[]>([]); //アプリケーションのデータ
  const form = useFormContext<FormPolicy>();
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // console.log("active", active);
    // console.log("over", over);
    if (!active.data.current || !("appId" in active.data.current)) return;

    if (
      over &&
      (over.id === "availableApps" ||
        over.id === "restrictedApps" ||
        over.id === "disabledApps")
    ) {
      const draggedApp = active.data.current as Apps;
      // console.log(draggedApp, "draggedApp");

      const packageName = draggedApp.packageName;
      const installType =
        over.id === "availableApps"
          ? "FORCE_INSTALLED"
          : over.id === "restrictedApps"
            ? "BLOCKED"
            : "AVAILABLE";
      const disabled = over.id === "disabledApps";
      const newApp = {
        packageName,
        installType,
        disabled,
      };
      console.log("newApp", newApp);

      const currentPolicyApps = form.getValues().policyData.applications;
      // console.log("currentPolicyApps", currentPolicyApps);
      // console.log("apps", apps);
      if (!currentPolicyApps) {
        form.setValue("policyData.applications", [newApp]);
        const updatedApps = apps.map((app) =>
          app.packageName === draggedApp.packageName
            ? { ...app, installType, disabled }
            : app
        );
        console.log("updatedApps", updatedApps);
        console.log("apps", apps);
        setApps(updatedApps);
        return;
      }
      // policyAppsに新しいアプリを追加、既存のアプリは更新
      const isExist = currentPolicyApps.some((app) => {
        // console.log(app.packageName);
        // console.log(packageName);

        return app.packageName === packageName;
      });
      // console.log(isExist);

      const updatedPolicyApps = isExist
        ? currentPolicyApps.map((app) =>
            app.packageName === packageName ? newApp : app
          )
        : [...currentPolicyApps, newApp];
      console.log("updatedPolicyApps", updatedPolicyApps);
      form.setValue("policyData.applications", updatedPolicyApps);

      // appsのデータに'installType, disabled'を追加、既存のアプリは更新
      // 更新したappsは、ApplicationLibraryコンポーネントには反映される。
      const updatedApps = apps.map((app) =>
        app.packageName === draggedApp.packageName
          ? { ...app, installType, disabled }
          : app
      );
      console.log("updatedApps", updatedApps);
      console.log("apps", apps);
      setApps(updatedApps);
    }
  };

  useEffect(() => {
    const policyApps = form.getValues().policyData.applications;
    console.log("policyApps", policyApps);

    console.log("apps", apps);
    if (policyApps) {
      const updatedApps = apps?.map((app) => ({
        ...app,
        installType: policyApps.find(
          (policyApp) => policyApp.packageName === app.packageName
        )?.installType,
        disabled: policyApps.find(
          (policyApp) => policyApp.packageName === app.packageName
        )?.disabled,
      }));
      console.log("updatedApps", updatedApps);
      setApps(updatedApps);
    } else {
      setApps(appsData);
    }
  }, [appsData, form]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <ScrollArea className="w-full h-full bg-blue-500 ">
        <div
          className={cn(
            `grid grid-cols-2 gap-4`,
            `px-4 py-8 overflow-hidden bg-red-500 h-dvh`

            // "overflow-y-auto"
          )}
        >
          <ApplicationLibrary apps={apps} />
          <AppManagement apps={apps} className="bg-yellow-500" />
        </div>
      </ScrollArea>
    </DndContext>
  );
}
