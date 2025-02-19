import Image from "next/image";

import heroImageConsole from "../images/hero-image-console.png";
import StartFreeAccountButton from "./start-free-account-button";

export default function Hero() {
  return (
    <section className="pt-1.5 pb-28">
      <div className="lg:pt-16 pt-5 grid lg:grid-cols-2 items-center">
        <div className="lg:text-left text-center mr-0 md:mr-18">
          <div className="mb-5 text-4xl md:text-6xl font-bold">
            <h1 className="leading-[1.17]">
              シンプルで理想的な
              <br />
              デバイス管理
            </h1>
          </div>
          <div className="mb-5 text-base md:text-lg">
            <p className="leading-relaxed">
              デバイス紛失時のセキュリティ対策。効率的なデバイスの資産管理。
              デバイスの一括設定により、ビジネスの効率化を実現します。
            </p>
          </div>
          <StartFreeAccountButton className="my-8" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <Image src={heroImageConsole} alt="hero-image-console-ui" />
        </div>
      </div>
    </section>
  );
}
