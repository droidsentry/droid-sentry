import { z } from "zod";
import { AndroidManagementPolicy, PolicyApps } from "../types/policy";

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

const deviceConnectivityManagementSchema = z
  .object({
    usbDataAccess: z
      .enum([
        "USB_DATA_ACCESS_UNSPECIFIED",
        "ALLOW_USB_DATA_TRANSFER",
        "DISALLOW_USB_FILE_TRANSFER",
        "DISALLOW_USB_DATA_TRANSFER",
      ])
      .nullable()
      .optional(),
  })
  .optional();

export const policySchema = z.object({
  adjustVolumeDisabled: z.boolean().default(false),
  factoryResetDisabled: z.boolean().default(false),
  screenCaptureDisabled: z.boolean().default(false),
  cameraDisabled: z.boolean().default(false),
  advancedSecurityOverrides: advancedSecurityOverridesSchema,
  bluetoothConfigDisabled: z.boolean().default(false),
  locationMode: z.enum(["LOCATION_ENFORCED", "LOCATION_UNSPECIFIED"]),
  modifyAccountsDisabled: z.boolean().default(false),
  mountPhysicalMediaDisabled: z.boolean().default(false),
  playStoreMode: z
    .enum(["BLACKLIST", "WHITELIST", "PLAY_STORE_MODE_UNSPECIFIED"])
    .nullable()
    .optional(),
  statusReportingSettings: statusReportingSettingsSchema,
  applications: z.array(applicationsSchema).optional(),
  deviceConnectivityManagement: deviceConnectivityManagementSchema,
}) satisfies z.ZodType<AndroidManagementPolicy>;

export const formPolicySchema = z.object({
  policyData: policySchema,
  policyDisplayName: z
    .string()
    .trim()
    .min(1, "ポリシー名を入力してください。")
    .optional(),
});

export const policyTableSchema = z.object({
  enterpriseId: z.string(),
  policyIdentifier: z.string(),
  policyDisplayName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.string(),
});
