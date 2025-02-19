import { PolicyList } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import SelectPolicyComboboxForm from "./select-policy-combobox-form";
import {
  SelectPolicyProvider,
  useSelectPolicy,
} from "./select-policy-provider";
import SubmitFormBotton from "./submit-form-botton";

export default function SelectPolicyDrawer({
  isOpen,
  setIsOpen,
  deviceIdentifiers,
  policyList,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  deviceIdentifiers: string[];
  policyList: PolicyList[];
}) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="">
        <div className="mx-auto w-full max-w-sm border rounded-lg">
          <SelectPolicyProvider
            deviceIdentifiers={deviceIdentifiers}
            policyList={policyList}
            setIsOpen={setIsOpen}
          >
            <DrawerHeader className="pb-0">
              <DrawerTitle>ポリシーを変更</DrawerTitle>
              <DrawerDescription className="sr-only">
                ポリシーを変更すると、デバイスの設定が変更されます。
              </DrawerDescription>
            </DrawerHeader>
            <div className="max-h-[500px] overflow-y-auto pt-4 pb-0">
              <div className="flex flex-col items-center justify-center space-x-2">
                <SelectPolicyComboboxForm />
                <div>カメラ無効</div>
                <div>スクリーンショット無効</div>
              </div>
              <div className="mt-3 h-[120px]"></div>
            </div>
            <DrawerFooter>
              <SubmitFormBotton />
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => console.log("cancel")}>
                  閉じる
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </SelectPolicyProvider>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
