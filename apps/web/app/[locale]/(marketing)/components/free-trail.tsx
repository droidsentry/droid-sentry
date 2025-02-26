import StartFreeAccountButton from "./start-free-account-button";
import UsageExperience from "./usage-experience";
import { MarketingPage } from "@/app/types/locale";

export default function FreeTrail({ data }: { data: MarketingPage }) {
  return (
    <section className="py-[34px] md:py-10 bg-muted/50 mt-10 mb-0">
      <div className="container mx-auto px-4 md:px-6 xl:px-[70px] grid md:grid-cols-2 md:gap-10 items-center">
        <div className="pt-[68px] md:pt-20 text-center md:text-left mb-2 md:mb-14">
          <h2 className="text-[30.6px]/[34px] md:text-[40px]/[46px] font-bold mb-[8.5px] md:mb-6">
            {data.FreeTrialTitle}
          </h2>
          <div className="mb-5 text-[15.3px]/[23.8px] md:text-lg">
            <p className="leading-relaxed">{data.FreeTrialText}</p>
          </div>
          <StartFreeAccountButton className="my-8" />
        </div>
        <div className="aspect-square size-full flex items-center justify-center">
          <div className="aspect-video w-full flex rounded-3xl border overflow-hidden p-3">
            {/* <Image
              src={quickStart}
              alt="quick start"
              className="object-cover p-20"
            /> */}
            <UsageExperience />
          </div>
        </div>
      </div>
    </section>
  );
}
//
