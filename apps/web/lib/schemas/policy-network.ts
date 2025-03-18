import { z } from "zod";

export const wifiSeuritySchema = z.enum(["None", "WEP-PSK", "WPA-PSK"]);
export const wifiMacRandomizationModeSchema = z
  .enum(["Hardware", "Software"])
  .optional();
export const WiFiConfigSchema = z
  .object({
    SSID: z.string().min(1, { message: "SSIDは必須です" }),
    Security: wifiSeuritySchema,
    Passphrase: z.string().trim().optional(),
    AutoConnect: z.boolean(),
    MACAddressRandomizationMode: wifiMacRandomizationModeSchema,
  })
  .superRefine((val, ctx) => {
    // 親オブジェクトのSecurityの値を取得
    const { Security, Passphrase } = val;

    // セキュリティがNoneの場合は検証をスキップ
    if (Security === "None") return;

    // パスワードが未設定の場合
    if (!Passphrase) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "セキュリティタイプが設定されている場合、パスワードは必須です",
        path: ["Passphrase"],
      });
      return;
    }

    // パスワードの長さチェック
    if (Passphrase.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "セキュリティタイプが設定されている場合、パスワードは8文字以上必要です",
        path: ["Passphrase"],
      });
      return;
    }
  });

export const NetworkConfigurationSchema = z.object({
  GUID: z.string(),
  Name: z.string(),
  Type: z.literal("WiFi"),
  WiFi: WiFiConfigSchema,
});
