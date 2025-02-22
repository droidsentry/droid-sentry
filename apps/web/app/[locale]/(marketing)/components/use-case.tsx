import Image from "next/image";
import ManUsingDevice from "../images/man-using-device.png";
import AppDistribution from "../images/app-distribution.png";
import LostDeviceMapsAndNavigation from "../images/lost-device-maps-and-navigation.png";
import { Card } from "@/components/ui/card";
import { MarketingPage } from "@/app/types/locale";

export default function UseCase({ data }: { data: MarketingPage }) {
  return (
    <section className="py-28">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-[40px]/[46px] font-bold mb-[34px] md:px-0 lg:mb-20 text-center">
          {data.UsageExperienceTitle}
        </h2>
      </div>
      <div className="pb-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb:pb-0 ">
        {data.UsageExperienceCard.map((card, index) => (
          <Card
            key={index}
            className="rounded-3xl md:size-full dark:bg-muted/50 bg-muted/10 p-6 border"
          >
            <div className="aspect-square flex items-center justify-center dark:bg-white bg-muted/50 rounded-3xl border mb-6">
              <Image src={AppDistribution} alt={card.title} />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">{card.title}</h3>
              <p className="text-base/relaxed ">{card.text}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
