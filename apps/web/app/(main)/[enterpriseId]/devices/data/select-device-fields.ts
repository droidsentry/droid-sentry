// export const selectDevicesTableFields = `
//         deviceId:device_id,
//         enterpriseId:enterprise_id,
//         policyIdentifier:policy_identifier,
//         deviceIdentifier:device_identifier,
//         deviceDisplayName:device_display_name,
//         device_data->>state,
//         device_data->>appliedState,
//         device_data->>lastSyncTime,
//         device_data->>policyCompliant,
//         device_data->>enrollmentTime,
//         device_data->>lastStatusReportTime,
//         createdAt:created_at,
//         updatedAt:updated_at,
//         ...policies!devices_enterprise_id_requested_policy_identifier_fkey (
//         policyDisplayName:policy_display_name
//         )
// `;

export const selectDevicesTableFields = `
        deviceId:device_id,
        enterpriseId:enterprise_id,
        policyIdentifier:policy_identifier,
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
        ...policies!devices_policy_reference_fkey (
        policyDisplayName:policy_display_name
        )
`;
