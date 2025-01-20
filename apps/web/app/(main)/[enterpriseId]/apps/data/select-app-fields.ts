export const selectAppFields = `
  appId:app_id,
  packageName:package_name,
  app_data->>title,
  app_data->>iconUrl,
  app_data->>updateTime,
  app_data->>minAndroidSdkVersion,
  app_data->>playStoreUrl,
  appType:app_type,
  app_data->>distributionChannel,
  createdAt:created_at,
  updatedAt:updated_at
`;
