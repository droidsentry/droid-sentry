import { Button } from "@/components/ui/button";
import { FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import SelectPolicyDrawer from "./select-policy-drawer";
import { toast } from "sonner";
import { Table } from "@tanstack/react-table";
import { DeviceTableType } from "@/app/types/device";
import { getPolicyList } from "../../actions/policy";
import { useParams } from "next/navigation";
import { RouteParams } from "@/app/types/enterprise";
import { SelectPolicyProvider } from "./select-policy-provider";
import { PolicyList } from "@/app/types/policy";
import { DrawerDemo } from "./demo/drawer-demo";

interface ChangePolicyButtonProps<TData> {
  table: Table<TData>;
  isSelected: boolean;
}

export default function ChangePolicyButton<TData>({
  isSelected,
  table,
}: ChangePolicyButtonProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [deviceIdentifiers, setDeviceIdentifiers] = useState<string[]>([]);
  const [policyList, setPolicyList] = useState<PolicyList[]>([]);
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;

  const handleOpenChange = async () => {
    // デバイスが選択されていない場合はエラーを表示
    if (!isSelected) {
      toast.error("デバイスを選択してください");
      return;
    }
    // デバイスの識別子のリストアップし、stateに格納
    const deviceIdentifiers = table
      .getSelectedRowModel()
      .rows.map((row) => {
        const deviceData = row.original as DeviceTableType;
        return deviceData.deviceIdentifier;
      })
      .filter((identifier): identifier is string => Boolean(identifier));
    setDeviceIdentifiers(deviceIdentifiers);
    // ポリシーのリストを取得し、stateに格納し、drawerを開く
    await getPolicyList(enterpriseId).then((data) => {
      setPolicyList(data);
      setIsOpen(true);
    });
  };

  return (
    <>
      <Button variant="outline" className="h-8" onClick={handleOpenChange}>
        ポリシーを変更する
        <FilePenLine className="ml-2 h-4 w-4" />
      </Button>
      {/* <DrawerDemo isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      <SelectPolicyDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deviceIdentifiers={deviceIdentifiers}
        policyList={policyList}
      />
    </>
  );
}
