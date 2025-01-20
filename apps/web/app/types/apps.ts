import { androidmanagement_v1 } from "googleapis";
import { z } from "zod";
import { AppsTableSchema, AppTypeSchema } from "../(main)/schema/apps";

export type AppsTableType = z.infer<typeof AppsTableSchema>;

type AppData = androidmanagement_v1.Schema$Application;

export type AppType = z.infer<typeof AppTypeSchema>;

export type SheetAppInfo = {
  appId: string;
  appData: AppData;
  appType: string;
};

/**
 * iframeの種類
 * https://developers.google.com/android/management/reference/rest/v1/enterprises.webTokens?hl=ja#iframefeature
 */
export type IframeType =
  | "PLAY_SEARCH"
  | "PRIVATE_APPS"
  | "WEB_APPS"
  | "STORE_BUILDER"
  | "MANAGED_CONFIGURATIONS"
  | "ZERO_TOUCH_CUSTOMER_MANAGEMENT";
