import Image from "next/image";
import { CardDemo } from "./components/card-deme";
import { marketingItems } from "../data/marketing-item";
import Hero from "./components/hero";
import Wave from "./wave";
import Link from "next/link";

import aePhoneImage from "./images/phone.webp";
import aerBadgeImage from "./images/aer-badge.webp";
import androidEnterImage from "./images/android-enterprise.webp";
import TechnologyStack from "./components/technology-stack";
import PhoneManegement from "./components/phone-manegement";
import PCConsoleAppsManegement from "./components/pc-console-apps-manegement";
import UseCase from "./components/use-case";
import FreeTrail from "./components/old/FreeTrail";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TechnologyStack />
      <PhoneManegement />
      <PCConsoleAppsManegement />
      <UseCase />
      {/* <FreeTrail /> */}
    </div>
  );
}
