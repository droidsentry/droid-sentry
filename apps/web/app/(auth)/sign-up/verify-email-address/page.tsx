import { Suspense } from "react";
import VerifyCard from "./verify-card";

export default function Page() {
  return (
    <div className="absolute inset-0 flex place-items-center">
      <div className="m-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyCard />
        </Suspense>
      </div>
    </div>
  );
}
