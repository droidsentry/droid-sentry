import { PolicyApp } from "@/app/types/policy";
import AppRestrictionToolBar from "./app-restriction-tool-bar";
import AppRestrictionZone from "./app-restriction-zone";
import Droppable from "./droppable";

export default function AppRestrictionManager({
  policyApps,
}: {
  policyApps: PolicyApp[];
}) {
  return (
    <div className="flex flex-col rounded-lg">
      <AppRestrictionToolBar className="basis-4/18 m-2" />
      {appManagements.map((appManagement) => (
        <Droppable
          key={appManagement.id}
          id={appManagement.id}
          className="relative basis-5/12 mx-2 mb-2"
        >
          {/* <h2 className="text-lg font-bold">{appManagement.title}</h2> */}
          <AppRestrictionZone policyApps={policyApps} id={appManagement.id} />
        </Droppable>
      ))}
    </div>
  );
}

const appManagements = [
  { id: "availableApps", title: "利用可能なアプリケーション" },
  { id: "restrictedApps", title: "制限するアプリケーション" },
] as const;
