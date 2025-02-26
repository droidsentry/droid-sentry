import { MarketingPage } from "@/app/types/locale";
import AppDistribution from "../images/app-distribution.png";
import ManUsingDevice from "../images/man-using-device.png";
import LostDeviceMapsAndNavigation from "../images/lost-device-maps-and-navigation.png";

const data: MarketingPage = {
  heroTitle: ["シンプルで理想的な", "デバイス管理"],
  heroText:
    "デバイス紛失時のセキュリティ対策。効率的なデバイスの資産管理。デバイスの一括設定により、ビジネスの効率化を実現します。",
  PhoneManagementTitle: "あらゆるAndroidデバイスをパワフルに管理できます。",
  PhoneManagementText: [
    "アプリを自動アンインストールできます。",
    "指定アプリを無効化できます。",
    "Wi-FiのSSID設定を配信できます。",
    "特定のアプリで画面固定できます。",
    "紛失モードで位置情報を取得できます。",
    "カメラや外部メディアなどの使用を制限できます。",
  ],
  PCConsoleAppsManagementTitle:
    "会社用のGoogleアカウントでアプリケーション管理",
  PCConsoleAppsManagementText: [
    "対象アプリの詳細情報を取得できます。",
    "個人のGoogleアカウント不要でアプリ配信できます。",
    "限定公開されたAndroidアプリを配信できます。",
    "プログレッシブWEBアプリ（PWA）を配信できます。",
  ],
  UsageExperienceTitle: "様々なケースでデバイス管理を効率化できます。",
  UsageExperienceCard: [
    {
      title: "アプリの一括配信",
      text: "業務で使用するアプリを一括配信できます。",
      image: AppDistribution,
    },
    {
      title: "初期設定の自動化",
      text: "初期設定の自動化を行うことで、デバイス配布やデバイス交換を効率化できます。",
      image: ManUsingDevice,
    },
    {
      title: "デバイス紛失時の位置情報取得",
      text: "デバイス紛失時の位置情報取得を行うことで、デバイスの位置を特定できます。",
      image: LostDeviceMapsAndNavigation,
    },
  ],
  TechnologyStackTitle: ["モダンな技術スタックで", "運用しています。"],
  TechnologyStackText: [
    "Next.js、Vercel、Supabaseなどの最新技術を採用することで、",
    "効率的な開発・運用を可能にしています。",
  ],
  FreeTrialTitle: "無料で、即日開始",
  FreeTrialText: `会社用のGoogleアカウント一つで、Androidデバイスの管理が始められます。
              まずは、無料トライアルで、Androidデバイスの管理を体験してください。
              先着500名、最大10台のAndroidデバイス分を無料でお試しいただけます。
              ご不明な点は、お気軽にお問い合わせください。`,
};

export default data;
