import "server-only";

import { createAndroidManagementClient } from "@/lib/emm/client";
import { saveDeviceStatus } from "@/app/api/emm/pubsub/lib/data/save-device";

/**
 * デバイス情報を同期する
 * @param enterpriseId
 * @param deviceIdentifier
 * @returns
 * PubSubでのデータ取得とデバイス一覧で取得したデータを同期するため、
 * AdminClientを使用している。デバイス一覧で使用する場合は、必ず認証確認を実施したのち
 * 使用すること。
 */
export const syncDeviceInfo = async (
  enterpriseId: string,
  deviceIdentifier: string
) => {
  const androidmanagement = await createAndroidManagementClient();
  const name = `enterprises/${enterpriseId}/devices/${deviceIdentifier}`;
  await androidmanagement.enterprises.devices
    .get({
      name,
    })
    .then(async (response) => {
      await saveDeviceStatus({
        enterpriseId,
        deviceIdentifier,
        device: response.data,
      });
    })
    .catch((error) => {
      // 404エラーの場合は、デバイスが存在しないか、デバイスが削除された可能性がある
      if (error.response.status === 404) {
        console.error(error.message);
        throw error.message;
      }
      throw new Error("Failed to fetch device from Google EMM");
    });
};
