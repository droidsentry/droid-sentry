export const selectDevicesTableFields = `
        id,
        policyId:policy_id,
        deviceId:device_id,
        deviceDisplayName:device_display_name,
        device_details->>state,
        device_details->>appliedState,
        device_details->>policyCompliant,
        device_details->>enrollmentTime,
        device_details->>lastSyncTime,
        device_details->>lastStatusReportTime,
        createdAt:created_at,
        updatedAt:updated_at,
        ...policies!devices_policy_id_fkey (
        policyDisplayName:policy_display_name
        )
`;
