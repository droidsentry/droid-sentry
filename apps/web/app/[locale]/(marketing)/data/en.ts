import { MarketingPage } from "@/app/types/locale";
import AppDistribution from "../images/app-distribution.png";
import ManUsingDevice from "../images/man-using-device.png";
import LostDeviceMapsAndNavigation from "../images/lost-device-maps-and-navigation.png";

const data: MarketingPage = {
  heroTitle: ["Simple and ideal", "Device Management"],
  heroText:
    "Security measures in case of device loss. Efficient device asset management. Batch configuration of devices to improve business efficiency.",
  PhoneManagementTitle: "You can manage all Android devices powerfully.",
  PhoneManagementText: [
    "You can automatically uninstall apps.",
    "You can disable specific apps.",
    "You can broadcast Wi-Fi SSID settings.",
    "You can lock the screen on specific apps.",
    "You can get location information in lost mode.",
    "You can restrict the use of the camera and external media.",
  ],
  PCConsoleAppsManagementTitle:
    "Manage applications with a company Google account",
  PCConsoleAppsManagementText: [
    "You can get detailed information about the target app.",
    "You can broadcast apps without a personal Google account.",
    "You can broadcast apps that are limited to publication.",
    "You can broadcast PWA (Progressive Web App).",
  ],
  UsageExperienceTitle: "You can efficiently manage devices in various cases.",
  UsageExperienceCard: [
    {
      title: "Bulk distribution of apps",
      text: "You can broadcast business apps.",
      image: AppDistribution,
    },
    {
      title: "Automated initial setup",
      text: "You can automate the initial setup to efficiently distribute devices to new employees.",
      image: ManUsingDevice,
    },
    {
      title: "Location information retrieval in case of device loss",
      text: "You can retrieve location information to locate the device.",
      image: LostDeviceMapsAndNavigation,
    },
  ],
  TechnologyStackTitle: ["We operate with", "modern technology stacks."],
  TechnologyStackText: [
    "We use the latest technologies such as Next.js, Vercel, and Supabase to efficiently develop and operate.",
  ],
  FreeTrialTitle: "Start for free, today",
  FreeTrialText: `You can start managing your Android devices with a single Google account for your company.
              Experience Android device management first with a free trial.
              The first 500 customers can try it for free for up to 10 Android devices.
              If you have any questions, please feel free to contact us.`,
};

export default data;
