import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>セキュリティ情報</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">管理モード</div>
              <div className="text-sm">TESTモード</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">メーカー</div>
              <div className="text-sm">Google</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">ハードウェア</div>
              <div className="text-sm">Pixel 7</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">IMEI</div>
              <div className="text-sm">1234567890</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">MEID</div>
              <div className="text-sm">1234567890</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">セキュリティポスチャ</div>
              <div className="text-sm font-medium">SECURE</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">ディスプレイサイズ</div>
              <div className="text-sm">6.3インチ(1080 x 2400)</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">外部ストレージ</div>
              <div className="text-sm">128GB</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">外部ストレージ空き</div>
              <div className="text-sm">100GB</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">内部ストレージ</div>
              <div className="text-sm">128GB</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="text-sm font-medium">内部ストレージ空き</div>
              <div className="text-sm">100GB</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const HardwareInfoItems = [
  {
    label: "管理モード",
    href: "hardware",
  },
];
