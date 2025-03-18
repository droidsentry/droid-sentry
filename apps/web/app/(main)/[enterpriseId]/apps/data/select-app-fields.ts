export const selectAppFields = `
  appId:app_id,
  packageName:package_name,
  app_details->>title,
  app_details->>iconUrl,
  app_details->>updateTime,
  app_details->>minAndroidSdkVersion,
  app_details->>playStoreUrl,
  appType:app_type,
  app_details->>distributionChannel,
  createdAt:created_at,
  updatedAt:updated_at
`;
