import { Button } from "@/components/ui/button";
import { useAppRestriction } from "./app-restriction-provider";
import { cn } from "@/lib/utils";

export default function AppRestrictionToolBar({
  className,
}: {
  className: string;
}) {
  const { setRestrictedAppPackages, setAppRestrictionConfigs } =
    useAppRestriction();
  const handleReset = () => {
    setRestrictedAppPackages({
      availableApps: [],
      restrictedApps: [],
    });
    setAppRestrictionConfigs([]);
  };
  return (
    <div className={cn("mt-2", className)}>
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-2">アプリケーション管理</h2>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-lg text-primary tracking-widest"
          >
            設定を全て解除
          </Button>
        </div>
      </div>
    </div>
  );
}
