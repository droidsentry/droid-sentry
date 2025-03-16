"use client";

import { appsColumns } from "../components/table/apps-columns";
import AppsTable from "../components/table/apps-table";

export default function CustomAppsContent() {
  // const pathname = usePathname();
  // const params = useParams();
  // const enterpriseName = "enterprises/" + params.id;
  // const appType = "PUBLIC";
  // const key = "/api/apps/" + appType;
  const apps = [
    {
      /**
       *     title: string;
    packageName: string;
    appId: string;
    iconUrl: string;
    appType: string;
    updatedAt: string;
    createdAt: string;
    updateTime: string;
    minAndroidSdkVersion: string;
    playStoreUrl: string;
    distributionChannel: string;
       */
      appId: "1",
      title: "サンプルアプリ",
      packageName: "com.example.sampleapp",
      iconUrl: "https://api.dicebear.com/9.x/icons/svg?seed=Mackenzie",
      updateTime: "2024-03-20T10:00:00Z",
      minAndroidSdkVersion: "26",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.example.sampleapp",
      appType: "PUBLIC",
      distributionChannel: "play_store",
      updatedAt: "2024-03-20T10:00:00Z",
      createdAt: "2024-03-01T09:00:00Z",
    },
  ];

  // return (
  //   <div className=" relative w-[330px] h-full rounded-lg overflow-hidden">
  //     <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  //       <Loader2Icon className="animate-spin size-10 text-muted-foreground/30" />
  //     </div>
  //   </div>

  // if (!apps) return null;

  // パス変更時にデータを再取得
  // useEffect(() => {
  //   mutate();
  // }, [pathname, mutate]);

  return <AppsTable columns={appsColumns} data={apps} />;
}
