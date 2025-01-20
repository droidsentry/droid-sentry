import { z } from "zod";

export const AppTypeSchema = z.enum(["PUBLIC", "PRIVATE", "WEB"]);

export const AppsTableSchema = z.object({
  appId: z.string(),
  packageName: z.string(),
  title: z.string(),
  iconUrl: z.string(),
  updateTime: z.string(),
  minAndroidSdkVersion: z.string(),
  playStoreUrl: z.string(),
  appType: z.string(),
  distributionChannel: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
});
