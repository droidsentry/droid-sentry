import { z } from "zod";

// export const DevicesTableSchema = z.object({
//   id: z.string(),
//   policyId: z.string().nullable(),
//   deviceId: z.string().nullable(),
//   deviceDisplayName: z.string().nullable(),
//   state: z.string(),
//   appliedState: z.string(),
//   lastSyncTime: z.string(),
//   policyCompliant: z.string(),
//   enrollmentTime: z.string(),
//   lastStatusReportTime: z.string(),
//   createdAt: z.string(),
//   updatedAt: z.string(),
//   policyDisplayName: z.string().nullable(), // ポリシー名の表示名
// });

export const DeviceResetPasswordSchema = z.object({
  password: z.string().min(6, "パスワードは6文字以上で設定してください"),
});

export const phoneNumberSchema = z
  .string()
  .trim()
  .min(1, {
    message: "電話番号を入力してください。",
  })
  .max(15, {
    message: "最大15文字までです。",
  })
  .transform((val) => val.replace(/[\(\)-]/g, ""));

export const emailSchema = z
  .string()
  .trim()
  .min(1, {
    message: "メールアドレスを入力してください。",
  })
  .email({
    message: "メールアドレスの形式で入力してください。",
  })
  .max(254, {
    message: "最大254文字までです。",
  });

export const addressSchema = z
  .string()
  .trim()
  .min(1, {
    message: "住所を入力してください。",
  })
  .max(161, {
    message: "最大161文字までです。",
  });

export const DeviceLostModeSchema = z.object({
  lostOrganization: z
    .string()
    .trim()
    .min(1, "任意の組織名を入力してください")
    .max(100, {
      message: "最大100文字までです。",
    }),
  lostMessage: z
    .string()
    .trim()
    .min(1, "任意のメッセージを入力してください")
    .max(100, {
      message: "最大100文字までです。",
    }),
  lostPhoneNumber: phoneNumberSchema,
  lostEmailAddress: emailSchema,
  lostStreetAddress: addressSchema,
});
