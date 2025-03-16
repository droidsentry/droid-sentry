"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { AppType } from "@/app/types/apps";
import { useIframeWebToken } from "../../lib/use-iframe-web-token";
import { initializeConfigurationsIframe } from "../../lib/initialize-configurations-iframe";

export default function AppConfigurationsIframe({
  className,
  enterpriseId,
  appType,
}: {
  className?: string;
  enterpriseId: string;
  appType: AppType;
}) {
  const containerRef = useRef<HTMLDivElement>(null); // iframeを配置するコンテナ
  const isInitializedRef = useRef(false); // 初期化フラグ
  const [currentUrl, setCurrentUrl] = useState<string>();
  const tokenType = "MANAGED_CONFIGURATIONS";
  const { token, error } = useIframeWebToken(
    enterpriseId,
    tokenType,
    currentUrl
  );
  const pathname = usePathname();

  const packageName = "com.lenovo.oemconfig.rel";

  const initialize = useCallback(
    (token: string) => {
      setCurrentUrl(window.location.origin);
      if (isInitializedRef.current) {
        // console.log("既に初期化済みです"); // ２回目以降画面を開くと前回のトークンと最新トークンが取得されるため初期化が２回実行される。そのため、初期化フラグを設定
        return;
      }
      const success = initializeConfigurationsIframe({
        token,
        containerRef,
        enterpriseId,
        appType,
        packageName,
        onSuccess: () => {
          isInitializedRef.current = true;
        },
        onError: (error) => {
          toast.error("iframeの初期化に失敗しました" + error);
        },
        pathname,
      });

      if (!success) {
        isInitializedRef.current = false;
      }
    },
    [enterpriseId, pathname, appType]
  );

  useEffect(() => {
    setCurrentUrl(window.location.origin);
    if (token && window.gapi) {
      // if (token && isLoaded) {
      initialize(token);
    }
  }, [initialize, token]);

  if (error) {
    toast.error("トークンの取得に失敗しました" + error);
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full relative", className)}
      aria-label="Google Play ウェブアプリ"
      role="region"
    />
  );
}
