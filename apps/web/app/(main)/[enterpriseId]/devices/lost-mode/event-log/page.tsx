"use client";

import { Button } from "@/components/ui/button";
import { getLog } from "./data/log";

export default function Page() {
  const handleDownloadLog = async () => {
    console.log("ログをダウンロード");
    await getLog();
  };

  return (
    <div>
      <h1>ログ</h1>
      <div>
        <Button variant="outline" onClick={handleDownloadLog}>
          ログをダウンロード
        </Button>
      </div>
    </div>
  );
}
