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

/**
 *      enterpriseId:enterprise_id,
        policyId:policy_id,
        deviceIdentifier:device_identifier,
        deviceDisplayName:device_display_name,
        device_data->>state,
        device_data->>appliedState,
        device_data->>lastSyncTime,
        device_data->>policyCompliant,
        device_data->>enrollmentTime,
        device_data->>lastStatusReportTime,
        createdAt:created_at,
        updatedAt:updated_at,
        ...policies (
            policyDisplayName:policy_display_name
            )
 */
