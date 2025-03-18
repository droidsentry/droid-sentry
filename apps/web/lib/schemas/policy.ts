import { z } from "zod";
import {
  AndroidManagementPolicy,
  DeviceConnectivityManagement,
  DisplaySettingsPolicy,
  PasswordRequirements,
  PolicyApps,
  ScreenBrightnessSettings,
  ScreenTimeoutSettings,
} from "../types/policy";

export type PolicyZodType = z.ZodType<AndroidManagementPolicy>;

/**
 * 高度なセキュリティ設定
 * https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#advancedsecurityoverrides
 */
const advancedSecurityOverridesSchema = z.object({
  untrustedAppsPolicy: z.enum([
    "UNTRUSTED_APPS_POLICY_UNSPECIFIED",
    "DISALLOW_INSTALL",
    "ALLOW_INSTALL_IN_PERSONAL_PROFILE_ONLY",
    "ALLOW_INSTALL_DEVICE_WIDE",
  ]),
  googlePlayProtectVerifyApps: z
    .enum([
      "GOOGLE_PLAY_PROTECT_VERIFY_APPS_UNSPECIFIED",
      "GOOGLE_PLAY_PROTECT_VERIFY_APPS_ALLOWED",
      "GOOGLE_PLAY_PROTECT_VERIFY_APPS_BLOCKED",
    ])
    .optional(),
  developerSettings: z.enum([
    "DEVELOPER_SETTINGS_ALLOWED",
    "DEVELOPER_SETTINGS_BLOCKED",
  ]),
  commonCriteriaMode: z
    .enum([
      "COMMON_CRITERIA_MODE_UNSPECIFIED",
      "COMMON_CRITERIA_MODE_ALLOWED",
      "COMMON_CRITERIA_MODE_BLOCKED",
    ])
    .optional(),
  personalAppsThatCanReadWorkNotifications: z.array(z.string()).optional(),
  mtePolicy: z
    .enum([
      "MTE_POLICY_UNSPECIFIED",
      "MTE_POLICY_ALLOWED",
      "MTE_POLICY_BLOCKED",
    ])
    .optional(),
  contentProtectionPolicy: z
    .enum([
      "CONTENT_PROTECTION_POLICY_UNSPECIFIED",
      "CONTENT_PROTECTION_POLICY_ALLOWED",
      "CONTENT_PROTECTION_POLICY_BLOCKED",
    ])
    .optional(),
});
// ステータスレポートの設定
const statusReportingSettingsSchema = z.object({
  applicationReportsEnabled: z.boolean().default(true),
  deviceSettingsEnabled: z.boolean().default(true),
  softwareInfoEnabled: z.boolean().default(true),
  memoryInfoEnabled: z.boolean().default(true),
  networkInfoEnabled: z.boolean().default(true),
  displayInfoEnabled: z.boolean().default(true),
  powerManagementEventsEnabled: z.boolean().default(true),
  hardwareStatusEnabled: z.boolean().default(true),
  systemPropertiesEnabled: z.boolean().default(true),
  applicationReportingSettings: z.object({
    includeRemovedApps: z.boolean().default(true),
  }),
  commonCriteriaModeEnabled: z.boolean().default(true),
});
const managedConfigurationTemplateSchema = z
  .object({
    // ManagedConfigurationTemplate の詳細なスキーマが必要な場合は追加
  })
  .optional();
const permissionGrantSchema = z.object({
  // PermissionGrant の詳細なスキーマが必要な場合は追加
});
const installConstraintSchema = z.object({
  // InstallConstraint の詳細なスキーマが必要な場合は追加
});
const extensionConfigSchema = z
  .object({
    // ExtensionConfig の詳細なスキーマが必要な場合は追加
  })
  .optional();
const applicationsSchema = z.object({
  accessibleTrackIds: z.array(z.string()).nullable().optional(),
  alwaysOnVpnLockdownExemption: z.string().nullable().optional(),
  autoUpdateMode: z.string().nullable().optional(),
  connectedWorkAndPersonalApp: z.string().nullable().optional(),
  credentialProviderPolicy: z.string().nullable().optional(),
  defaultPermissionPolicy: z.string().nullable().optional(),
  delegatedScopes: z.array(z.string()).nullable().optional(),
  disabled: z.boolean().nullable().optional(),
  extensionConfig: extensionConfigSchema.optional(),
  installConstraint: z.array(installConstraintSchema).optional(),
  installPriority: z.number().min(0).max(10000).nullable().optional(),
  installType: z.string().nullable().optional(),
  lockTaskAllowed: z.boolean().nullable().optional(),
  managedConfiguration: z.record(z.any()).nullable().optional(),
  managedConfigurationTemplate: managedConfigurationTemplateSchema,
  minimumVersionCode: z.number().nullable().optional(),
  packageName: z.string().nullable().optional(),
  permissionGrants: z.array(permissionGrantSchema).optional(),
  userControlSettings: z.string().nullable().optional(),
  workProfileWidgets: z.string().nullable().optional(),
}) satisfies z.ZodType<PolicyApps>;

const deviceConnectivityManagementSchema = z.object({
  usbDataAccess: z
    .enum([
      "USB_DATA_ACCESS_UNSPECIFIED",
      "ALLOW_USB_DATA_TRANSFER",
      "DISALLOW_USB_FILE_TRANSFER",
      "DISALLOW_USB_DATA_TRANSFER",
    ])
    .nullable()
    .optional(),
}) satisfies z.ZodType<DeviceConnectivityManagement>;
// export const autoDateAndTimeZoneSchema = z.object({
//   autoDateAndTimeZone: z
//     .enum([
//       "AUTO_DATE_AND_TIME_ZONE_UNSPECIFIED",
//       "AUTO_DATE_AND_TIME_ZONE_ENABLED",
//       "AUTO_DATE_AND_TIME_ZONE_DISABLED",
//     ])
//     .default("AUTO_DATE_AND_TIME_ZONE_UNSPECIFIED"),
// });

// export const microphoneAccessSchema = z.object({
//   microphoneAccess: z
//     .enum([
//       "MICROPHONE_ACCESS_UNSPECIFIED",
//       "MICROPHONE_ACCESS_USER_CHOICE",
//       "MICROPHONE_ACCESS_DISABLED",
//       "MICROPHONE_ACCESS_ENFORCED",
//     ])
//     .default("AUTO_DATE_AND_TIME_ZONE_UNSPECIFIED"),
// });

// export const developerSettingsSchema = z.object({
//   developerSettings: z
//     .enum([
//       "DEVELOPER_SETTINGS_UNSPECIFIED",
//       "DEVELOPER_SETTINGS_DISABLED",
//       "DEVELOPER_SETTINGS_ALLOWED",
//     ])
//     .default("DEVELOPER_SETTINGS_UNSPECIFIED"),
// });
export const cameraAccessSchema = z
  .enum([
    "CAMERA_ACCESS_UNSPECIFIED",
    "CAMERA_ACCESS_USER_CHOICE",
    "CAMERA_ACCESS_DISABLED",
    "CAMERA_ACCESS_ENFORCED",
  ])
  .default("CAMERA_ACCESS_UNSPECIFIED")
  .nullable()
  .optional();

const ScreenBrightnessSettingsSchema = z.object({
  screenBrightness: z.number().nullable().optional(),
  screenBrightnessMode: z.string().nullable().optional(),
}) satisfies z.ZodType<ScreenBrightnessSettings>;
const ScreenTimeoutSettingsSchema = z
  .object({
    screenTimeout: z
      .string()
      .refine((screenTimeout) => {
        console.log("screenTimeout", screenTimeout);
        if (screenTimeout === "0s") return false;
        return true;
      }, "0以上を入力してください。")
      .nullable()
      .optional(),
    screenTimeoutMode: z
      .enum([
        "SCREEN_TIMEOUT_MODE_UNSPECIFIED",
        "SCREEN_TIMEOUT_USER_CHOICE",
        "SCREEN_TIMEOUT_ENFORCED",
      ])
      .default("SCREEN_TIMEOUT_MODE_UNSPECIFIED")
      .nullable()
      .optional(),
  })
  .refine(
    (args) => {
      const { screenTimeout, screenTimeoutMode } = args;
      if (screenTimeoutMode === "SCREEN_TIMEOUT_ENFORCED" && !screenTimeout) {
        return false;
      }
      return true;
    },
    {
      message: "画面消灯時間を入力してください。",
      path: ["screenTimeout"],
    }
  ) satisfies z.ZodType<ScreenTimeoutSettings>;
const DisplaySettingsPolicySchema = z.object({
  // screenBrightnessSettings: ScreenBrightnessSettingsSchema,
  screenTimeoutSettings: ScreenTimeoutSettingsSchema.optional(),
}) satisfies z.ZodType<DisplaySettingsPolicy>;

export const passwordPoliciesSchema = z.object({
  passwordMinimumLength: z.number().nullable().optional(),
  passwordMinimumLetters: z.number().nullable().optional(),
  passwordMinimumLowerCase: z.number().nullable().optional(),
  passwordMinimumNonLetter: z.number().nullable().optional(),
  passwordMinimumNumeric: z.number().nullable().optional(),
  passwordMinimumSymbols: z.number().nullable().optional(),
  passwordMinimumUpperCase: z.number().nullable().optional(),
  passwordQuality: z
    .enum([
      "PASSWORD_QUALITY_UNSPECIFIED",
      "BIOMETRIC_WEAK",
      "SOMETHING",
      "NUMERIC",
      "NUMERIC_COMPLEX",
      "ALPHABETIC",
      "ALPHANUMERIC",
      "COMPLEX",
      "COMPLEXITY_LOW",
      "COMPLEXITY_MEDIUM",
      "COMPLEXITY_HIGH",
    ])
    .nullable()
    .optional(),
  passwordHistoryLength: z.number().nullable().optional(),
  maximumFailedPasswordsForWipe: z.number().nullable().optional(),
  passwordExpirationTimeout: z.string().nullable().optional(),
  passwordScope: z
    .enum(["SCOPE_UNSPECIFIED", "SCOPE_DEVICE", "SCOPE_PROFILE"])
    .nullable()
    .optional(),
  requirePasswordUnlock: z.enum([
    "REQUIRE_PASSWORD_UNLOCK_UNSPECIFIED",
    "USE_DEFAULT_DEVICE_TIMEOUT",
    "REQUIRE_EVERY_DAY",
  ]),
  unifiedLockSettings: z.enum([
    "UNIFIED_LOCK_SETTINGS_UNSPECIFIED",
    "ALLOW_UNIFIED_WORK_AND_PERSONAL_LOCK",
    "REQUIRE_SEPARATE_WORK_LOCK",
  ]),
}) satisfies z.ZodType<PasswordRequirements>;

const wifiConfigSchema = z.object({
  SSID: z.string(),
  Security: z.enum(["None", "WEP-PSK", "WPA-PSK", "WPA2-PSK", "WPA3-PSK"]),
  Passphrase: z.string().optional(),
  AutoConnect: z.boolean().optional(),
  MACAddressRandomizationMode: z
    .enum(["Hardware", "Software", "None"])
    .optional(),
});

export const networkConfigurationSchema = z.object({
  GUID: z.string(),
  Name: z.string(),
  Type: z.literal("WiFi"),
  WiFi: wifiConfigSchema,
});
export const networkConfigurationsSchema = z
  .array(networkConfigurationSchema)
  .optional();
export const openNetworkConfigurationSchema = z
  .object({
    NetworkConfigurations: networkConfigurationsSchema,
  })
  .nullable()
  .optional();

export const policySchema = z
  .object({
    screenCaptureDisabled: z.boolean().optional(),
    adjustVolumeDisabled: z.boolean().default(false).optional(),
    factoryResetDisabled: z.boolean().default(false).optional(),
    cameraDisabled: z.boolean().default(false).optional(),
    advancedSecurityOverrides: advancedSecurityOverridesSchema.optional(),
    bluetoothConfigDisabled: z.boolean().default(false).optional(),
    locationMode: z
      .enum([
        "LOCATION_MODE_UNSPECIFIED",
        "LOCATION_USER_CHOICE",
        "LOCATION_ENFORCED",
        "LOCATION_UNSPECIFIED",
      ])
      .optional(),
    modifyAccountsDisabled: z.boolean().default(false),
    mountPhysicalMediaDisabled: z.boolean().default(false),
    playStoreMode: z
      .enum(["BLACKLIST", "WHITELIST", "PLAY_STORE_MODE_UNSPECIFIED"])
      .optional(),
    statusReportingSettings: statusReportingSettingsSchema.optional(),
    applications: z.array(applicationsSchema).optional(),
    deviceConnectivityManagement: deviceConnectivityManagementSchema.optional(),
    smsDisabled: z.boolean().default(false).optional(),
    cellBroadcastsConfigDisabled: z.boolean().default(false).optional(),
    outgoingBeamDisabled: z.boolean().default(false).optional(),
    outgoingCallsDisabled: z.boolean().default(false).optional(),
    cameraAccess: cameraAccessSchema.optional(),
    addUserDisabled: z.boolean().default(false).optional(),
    removeUserDisabled: z.boolean().default(false).optional(),
    stayOnPluggedModes: z
      .array(
        z.enum(["BATTERY_PLUGGED_MODE_UNSPECIFIED", "AC", "USB", "WIRELESS"])
      )
      .default(["BATTERY_PLUGGED_MODE_UNSPECIFIED"])
      .nullable()
      .optional(),
    maximumTimeToLock: z.string().nullable().optional(),
    displaySettings: DisplaySettingsPolicySchema.optional(),
    shareLocationDisabled: z.boolean().default(false).optional(),
    passwordPolicies: z.array(passwordPoliciesSchema).optional(),
    mobileNetworksConfigDisabled: z.boolean().nullable().optional(),
    dataRoamingDisabled: z.boolean().default(false).optional(),
    networkResetDisabled: z.boolean().default(false).optional(),
    openNetworkConfiguration: openNetworkConfigurationSchema,
  })
  .superRefine((args, ctx) => {
    validateScreenTimeoutAndLock(
      args.displaySettings?.screenTimeoutSettings?.screenTimeout,
      args.maximumTimeToLock,
      ctx
    );
  }) satisfies z.ZodType<AndroidManagementPolicy>;

export const formPolicySchema = z.object({
  policyDetails: policySchema,
  policyDisplayName: z
    .string()
    .trim()
    .min(1, "ポリシー名を入力してください。")
    .default(""),
});

/**
 * 型チェック
 * タイポミスのみを検知する型チェック
 */
type policyDetails = z.infer<typeof policySchema>;
// タイポミスのみを検知する型チェック
type _CheckTypoKeys = keyof policyDetails extends keyof AndroidManagementPolicy //
  ? true
  : {
      error: "スキーマに存在するキーがインターフェースに存在しません（タイポの可能性）";
      keys: Exclude<keyof policyDetails, keyof AndroidManagementPolicy>;
    };
// 対応する型がない場合はエラーを出力
const _exactCheck: true = {} as _CheckTypoKeys;

/**
 * 時間文字列をミリ秒に変換する
 * @param timeStr - 変換する時間文字列
 *                 - 分指定の場合: "5m" のような形式
 *                 - 秒指定の場合: "1800" のような形式
 * @returns 秒数
 */
const parseTimeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;

  // 分指定（"xxm"形式）の場合
  const secondMatch = timeStr.match(/^(\d+)s$/);
  if (secondMatch) {
    const seconds = parseInt(secondMatch[1], 10);
    if (seconds < 0) return 0;
    return seconds * 1000;
  }

  // 秒指定（数値文字列）の場合
  const seconds = parseInt(timeStr, 10);
  if (isNaN(seconds) || seconds < 0) return 0;
  return seconds;
};

/**
 * 画面タイムアウトと画面ロックの時間を検証する
 * @param screenTimeout 画面タイムアウトの時間
 * @param maximumTimeToLock 画面ロックまでの最大時間
 * @param ctx Zodのコンテキスト
 * @returns 検証結果
 */
const validateScreenTimeoutAndLock = (
  screenTimeout: string | null | undefined,
  maximumTimeToLock: string | null | undefined,
  ctx: z.RefinementCtx
): boolean => {
  if (!screenTimeout || !maximumTimeToLock) return true;

  // console.log("screenTimeout", screenTimeout);
  // console.log("maximumTimeToLock", maximumTimeToLock);

  const timeoutSeconds = parseTimeToSeconds(screenTimeout);
  console.log("timeoutSeconds", timeoutSeconds);
  const maxLockSeconds = parseTimeToSeconds(maximumTimeToLock);
  console.log("maxLockSeconds", maxLockSeconds);

  if (timeoutSeconds > maxLockSeconds) {
    console.log(
      "画面ロックまでの最大時間は、画面消灯の最大時間以上である必要があります。"
    );
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "画面ロックまでの最大時間は、画面消灯の最大時間以上である必要があります。",
      path: ["displaySettings", "screenTimeoutSettings", "screenTimeout"],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "画面消灯の最大時間は、画面ロックまでの最大時間以下である必要があります。",
      path: ["maximumTimeToLock"],
    });
    return false;
  }
  return true;
};
