import Image from "next/image";
import ManUsingDevice from "../images/man-using-device.png";
import AppDistribution from "../images/app-distribution.png";
import LostDeviceMapsAndNavigation from "../images/lost-device-maps-and-navigation.png";
import { Card } from "@/components/ui/card";

export default function UseCase() {
  return (
    <section className="py-28">
      <div className="px-4 md:px-6 xl:px-0 flex flex-col justify-center items-center">
        <h2 className="text-[40px]/[46px] font-bold mb-[34px] md:px-0 lg:mb-20 text-center ">
          様々なケースでデバイス管理を効率化できます。
        </h2>
      </div>
      <div className="px-4 md:px-6 xl:px-0 pb-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb:pb-0 ">
        <Card className="rounded-3xl md:size-full dark:bg-muted/50 bg-muted/10 p-6 border">
          <div className="aspect-square flex items-center justify-center dark:bg-white bg-muted/50 rounded-3xl border mb-6">
            <Image src={AppDistribution} alt="App Distribution" className="" />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">アプリの一括配信</h3>
            <p className="text-base/relaxed text-muted-foreground">
              業務で使用するアプリを一括配信できます。
            </p>
          </div>
        </Card>
        <Card className="rounded-3xl md:size-full dark:bg-muted/50 bg-muted/10 p-6 border">
          <div className="aspect-square flex items-center justify-center dark:bg-white bg-muted/50 rounded-3xl border mb-6">
            <Image src={ManUsingDevice} alt="App Distribution" className="" />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">初期設定の自動化</h3>
            <p className="text-base/relaxed text-muted-foreground">
              初期設定の自動化を行うことで、新入社員のデバイス配布を効率化できます。
            </p>
          </div>
        </Card>
        <Card className="rounded-3xl md:size-full dark:bg-muted/50 bg-muted/10 p-6 border">
          <div className="aspect-square flex items-center justify-center dark:bg-white bg-muted/50 rounded-3xl border mb-6">
            <Image
              src={LostDeviceMapsAndNavigation}
              alt="App Distribution"
              className=""
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">デバイス紛失時の位置情報取得</h3>
            <p className="text-base/relaxed text-muted-foreground">
              デバイス紛失時の位置情報取得を行うことで、デバイスの位置を特定できます。
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
