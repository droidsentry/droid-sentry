"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { AppType } from "@/app/types/apps";
import { useIframeWebToken } from "../../lib/use-iframe-web-token";
import { initializePlayIframe } from "../../lib/initialize-iframe";

export default function PrivateAppIframe({
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
  const tokenType = "PRIVATE_APPS";
  const pathname = usePathname();
  const { token, error } = useIframeWebToken(
    enterpriseId,
    tokenType,
    currentUrl
  );

  const initialize = useCallback(
    (token: string) => {
      if (isInitializedRef.current) {
        // ２回目以降画面を開くと前回のトークンと最新トークンが取得されるため初期化が２回実行される。そのため、初期化フラグを設定
        return;
      }
      const success = initializePlayIframe({
        token,
        containerRef,
        enterpriseId,
        appType,
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
