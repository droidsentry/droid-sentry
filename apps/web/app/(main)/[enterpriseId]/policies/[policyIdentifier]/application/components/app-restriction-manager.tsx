import { PolicyApp } from "@/app/types/policy";
import AppRestrictionToolBar from "./app-restriction-tool-bar";
import AppRestrictionZone from "./app-restriction-zone";
import Droppable from "./droppable";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppRestrictionManager({
  policyApps,
}: {
  policyApps: PolicyApp[];
}) {
  return (
    <div className="flex flex-col rounded-lg space-y-2 ">
      <AppRestrictionToolBar className=" mx-2" />
      {appManagements.map((appManagement) => (
        <Droppable
          key={appManagement.id}
          id={appManagement.id}
          className="basis-5/12 mx-2 pb-6 overflow-hidden flex-1"
        >
          <CardHeader className="pb-3">
            <CardTitle>{appManagement.title}</CardTitle>
          </CardHeader>
          <CardContent className="size-full">
            <AppRestrictionZone policyApps={policyApps} id={appManagement.id} />
          </CardContent>
        </Droppable>
      ))}
    </div>
  );
}

const appManagements = [
  { id: "availableApps", title: "利用可能なアプリケーション" },
  { id: "restrictedApps", title: "制限するアプリケーション" },
] as const;
