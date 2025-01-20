import Image from "next/image";
import { CardDemo } from "./components/card-deme";
import { marketingItems } from "../data/marketing-item";
import Hero from "./hero";
import Wave from "./wave";
import Link from "next/link";

import aePhoneImage from "./images/phone.webp";
import aerBadgeImage from "./images/aer-badge.webp";
import androidEnterImage from "./images/android-enterprise.webp";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <section className="flex py-10 dark:bg-zinc-900 bg-[#57B0FF] flex-col-reverse md:flex-row justify-evenly items-center">
        <div className="flex flex-col justify-evenly items-center gap-12">
          <div className="mt-5 gap-14 flex flex-row items-center">
            <Image
              src={aerBadgeImage}
              alt="AER_Badge"
              className="h-16 w-auto"
            />
            <Image
              src={androidEnterImage}
              alt="AndroidEnterpriseSilverPartner"
              className="h-16 w-auto"
            />
          </div>
          {marketingItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-6 mx-3"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl ">
                {item.title}
              </h2>
              <p className="text-center">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={aePhoneImage}
            alt="Android Enterprise Phone"
            className="w-[150px] md:w-auto md:h-[500px] ml-1 md:ml-2"
          />
          <Link
            className="my-5 flex items-center w-fit mx-auto text-black text-sm h-10 px-6 justify-center rounded-full bg-red-300 hover:bg-red-300/90"
            href="/sign-in"
          >
            今すぐお試しください！
          </Link>
        </div>
      </section>
      <section className="pb-20">
        <Wave direction="up" />
        <div className="px-4">
          <CardDemo className="mx-auto" />
        </div>
      </section>
    </div>
  );
}
