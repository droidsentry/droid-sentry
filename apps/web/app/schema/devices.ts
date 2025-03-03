import { z } from "zod";

export const DevicesTableSchema = z.object({
  deviceId: z.string(),
  enterpriseId: z.string(),
  policyIdentifier: z.string().nullable(),
  deviceIdentifier: z.string().nullable(),
  deviceDisplayName: z.string().nullable(),
  state: z.string(),
  appliedState: z.string(),
  lastSyncTime: z.string(),
  policyCompliant: z.string(),
  enrollmentTime: z.string(),
  lastStatusReportTime: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  policyDisplayName: z.string().nullable(), // ポリシー名の表示名
});

export const DeviceResetPasswordSchema = z.object({
  password: z.string().min(6, "パスワードは6文字以上で設定してください"),
});
