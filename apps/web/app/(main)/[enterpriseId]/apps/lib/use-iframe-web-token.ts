"use client";

import useSWR from "swr";

import { IframeType } from "@/app/types/apps";
import { getIframeWebToken } from "../../actions/get-iframe-web-token";

/**
 * Android Management APIのWeb Tokenを取得
 * @param enterpriseId
 * @param tokenType　iframeの種類
 * @returns
 */
export function useIframeWebToken(
  enterpriseId: string,
  tokenType: IframeType,
  currentUrl?: string
) {
  const key = `/api/apps/${enterpriseId}/iframe/${tokenType}`;
  const { data, error, isLoading, mutate } = useSWR(
    currentUrl ? key : null,
    () => getIframeWebToken({ enterpriseId, tokenType, currentUrl }),
    {
      dedupingInterval: 3600000, // 1時間、関数を実行しない
      revalidateOnFocus: false, // タブ移動しても関数を実行しない　//iframeの操作も検知されるため、追加
    }
  );

  return {
    token: data?.value,
    isLoading,
    error,
    mutate,
  };
}
