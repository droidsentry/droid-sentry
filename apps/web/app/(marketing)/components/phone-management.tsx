import { CircleCheck } from "lucide-react";
import Image from "next/image";
import PhoneFeatureGraphic from "../images/phone-management.png";
import StartFreeAccountButton from "./start-free-account-button";

export default function PhoneManagement() {
  return (
    <section className="pt-20">
      <div className="w-full grid gap-y-8 lg:grid-cols-2 items-center justify-between md:gap-x-6 py-0">
        <Image src={PhoneFeatureGraphic} alt="phone-management" />
        <div className="md:pr-16">
          <h2 className="text-[25.5px]/[30.6px] md:text-[40px]/[46px] font-bold mb-[8.5px] mb:mb-6">
            あらゆるAndroidデバイスをパワフルに管理できます。
          </h2>
          <ul className="flex flex-col gap-y-4 mt-10">
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500" />
              <span className="text-[15.3px]/[23.8px] md:text-lg">
                アプリを自動アンインストールできます。
              </span>
            </li>
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500" />
              <span className="text-[15.3px]/[23.8px] md:text-lg">
                指定アプリを無効化できます。
              </span>
            </li>
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500" />
              <span className="text-[15.3px]/[23.8px] md:text-lg">
                Wi-FiのSSID設定を配信できます。
              </span>
            </li>
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500" />
              <span className="text-[15.3px]/[23.8px] md:text-lg">
                特定のアプリで画面固定できます。
              </span>
            </li>
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500" />
              <span className="text-[15.3px]/[23.8px] md:text-lg">
                紛失モードで位置情報を取得できます。
              </span>
            </li>
            <li className="flex gap-x-4 items-center">
              <CircleCheck className="w-6 h-6 text-green-500 shrink-0" />
              <span className="text-[15.3px]/[23.8px] md:text-lg">
                定期的に、Googleにより新機能追加、バグ修正などメンテナンスされています。
              </span>
            </li>
          </ul>
          <StartFreeAccountButton className="mt-16" />
        </div>
      </div>
    </section>
  );
}
