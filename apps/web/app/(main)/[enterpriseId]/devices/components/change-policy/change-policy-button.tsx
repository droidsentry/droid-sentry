import { DeviceTableType } from "@/app/types/device";
import { RouteParams } from "@/app/types/enterprise";
import { PolicyList } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { FilePenLine } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getPolicyList } from "../../actions/policy";
import SelectPolicyDrawer from "./select-policy-drawer";
import TitleTooltip from "@/components/title-tooltip";

interface ChangePolicyButtonProps<TData> {
  table: Table<TData>;
  isSelected: boolean;
}

export default function ChangePolicyButton<TData>({
  table,
  isSelected,
}: ChangePolicyButtonProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [deviceIdentifiers, setDeviceIdentifiers] = useState<string[]>([]);
  const [policyList, setPolicyList] = useState<PolicyList[]>([]);
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;

  const handleOpenChange = async () => {
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
      <TitleTooltip tooltip="選択したデバイスのポリシーを変更する">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenChange}
          tabIndex={isSelected ? 0 : -1}
          disabled={!isSelected}
        >
          <FilePenLine className="size-6" />
        </Button>
      </TitleTooltip>
      <SelectPolicyDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deviceIdentifiers={deviceIdentifiers}
        policyList={policyList}
      />
    </>
  );
}
