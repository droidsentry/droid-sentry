import { CircleCheck } from "lucide-react";
import Image from "next/image";
import PhoneFeatureGraphic from "../images/phone-management.png";
import StartFreeAccountButton from "./start-free-account-button";
import { MarketingPage } from "@/app/types/locale";

export default function PhoneManagement({ data }: { data: MarketingPage }) {
  return (
    <section className="pt-20">
      <div className="w-full grid gap-y-8 lg:grid-cols-2 items-center justify-between md:gap-x-6 py-0">
        <Image src={PhoneFeatureGraphic} alt="phone-management" priority />
        <div className="md:pr-16">
          <h2 className="text-[25.5px]/[30.6px] md:text-[40px]/[46px] font-bold mb-[8.5px] mb:mb-6">
            {data.PhoneManagementTitle}
          </h2>
          <ul className="flex flex-col gap-y-4 mt-10">
            {data.PhoneManagementText.map((text, index) => (
              <li key={index} className="flex gap-x-4 items-center">
                <CircleCheck className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-[15.3px]/[23.8px] md:text-lg">
                  {text}
                </span>
              </li>
            ))}
          </ul>
          <StartFreeAccountButton className="mt-16" />
        </div>
      </div>
    </section>
  );
}
