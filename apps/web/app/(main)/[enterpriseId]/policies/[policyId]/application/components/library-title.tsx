// import { Apps } from "@/lib/types/policy";
import { PolicyApp } from "@/lib/types/policy";
import { CardTitle } from "@/components/ui/card";

import Image from "next/image";

export default function AppLibraryTitle({
  policyApp,
}: {
  policyApp: PolicyApp;
}) {
  return (
    <>
      <div className="relative">
        <div className="relative border rounded-md size-10 overflow-hidden">
          <Image
            src={policyApp.iconUrl}
            alt={policyApp.title}
            fill
            sizes="40px"
          />
        </div>
      </div>
      <CardTitle
        className="truncate pl-2 text-lg flex-1 w-5"
        title={policyApp.title}
      >
        {policyApp.title}
      </CardTitle>
    </>
  );
}
