import { Policy } from "@/lib/types/policy";

/**
 * ポリシーのデフォルトリクエストボディ
 * @see https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#PlayStoreMode
 */
export const defaultPolicyRequestBody: Policy = {
  advancedSecurityOverrides: {
    untrustedAppsPolicy: "ALLOW_INSTALL_DEVICE_WIDE", // 信頼できないアプリ（提供元不明のアプリ）の許可
    developerSettings: "DEVELOPER_SETTINGS_ALLOWED", //開発者向け設定（開発者向けオプションとセーフブート）へのアクセス
  },
  bluetoothConfigDisabled: false, // Bluetooth設定の無効化
  cameraDisabled: false, // カメラ無効化
  factoryResetDisabled: false, // ファクトリーリセットの無効化
  locationMode: "LOCATION_ENFORCED", // 位置情報モード
  modifyAccountsDisabled: false, // アカウントの変更を無効化
  mountPhysicalMediaDisabled: false, // 物理メディアのマウントを無効化
  playStoreMode: "PLAY_STORE_MODE_UNSPECIFIED", // Google Play ストア モード ポリシーに指定できる値。
  screenCaptureDisabled: false, // 画面キャプチャの無効化
  statusReportingSettings: {
    applicationReportsEnabled: true, // アプリケーションのレポートを有効化
    deviceSettingsEnabled: true, // デバイス設定のレポートを有効化
    softwareInfoEnabled: true, // ソフトウェア情報のレポートを有効化
    memoryInfoEnabled: true, // メモリ情報のレポートを有効化
    networkInfoEnabled: true, // ネットワーク情報のレポートを有効化
    displayInfoEnabled: true, // ディスプレイ情報のレポートを有効化
    powerManagementEventsEnabled: true, // 電源管理イベントのレポートを有効化
    hardwareStatusEnabled: true, // ハードウェアステータスのレポートを有効化
    systemPropertiesEnabled: true, // システムプロパティのレポートを有効化
    applicationReportingSettings: {
      includeRemovedApps: true, // 削除されたアプリケーションを含める
    },
    commonCriteriaModeEnabled: true, // 一般基準モードを有効化
  },
  // deviceConnectivityManagement: { // https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#deviceconnectivitymanagement
  //   usbDataAccess: "USB_DATA_ACCESS_ALLOWED", // USBデータアクセスの許可 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#usbdataaccess
  //   configureWifi: "CONFIGURE_WIFI_ALLOWED", // Wi-Fi設定の許可 //https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#configurewifi
  //   wifiDirectSettings: "WIFI_DIRECT_SETTINGS_ALLOWED", // Wi-Fi Direct設定の許可 Wi-Fi Direct の設定を管理します。Android 13 以降を搭載した会社所有のデバイスでサポート https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#wifidirectsettings
  //   tetheringSettings: "TETHERING_SETTINGS_ALLOWED", // テザリング設定の許可 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#tetheringsettings
  //   wifiSsidPolicy: { //デバイスが接続できる Wi-Fi SSID の制限 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#wifissidpolicy
  //     wifiSsidPolicyType: "WIFI_SSID_POLICY_TYPE_UNSPECIFIED", // デバイスに適用できる Wi-Fi SSID ポリシーの種類 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#wifissidpolicytype
  //     wifiSsids: [ // デバイスが接続できる Wi-Fi SSID のリスト https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#wifissid
  //       {
  //         "wifiSsid": "string"
  //       },
  //       {
  //         "wifiSsid": "string"
  //       }
  //     ]
  //   },
  //   wifiRoamingPolicy: { // Wi-Fi ローミング ポリシー。 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#wifiroamingpolicy
  //     wifiRoamingSettings: [ //Wi-Fi ローミングの設定。 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#wifiroamingsetting
  //       {
  //         wifiSsid: "string",
  //         wifiRoamingMode: "WIFI_ROAMING_MODE_UNSPECIFIED"
  //       }
  //     ]
  //   }
  // },
  // applications: [
  //   {
  //     //https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#applicationpolicy
  //     packageName: "string",
  //     installType: "PREINSTALLED", // https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#installtype
  //     lockTaskAllowed: true,
  //     defaultPermissionPolicy: "GRANT", // https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#permissionpolicy
  //     permissionGrants: [
  //       // https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#permissiongrant
  //       {
  //         permission: "string",
  //         policy: "GRANT", // https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#permissionpolicy
  //       },
  //     ],
  //     managedConfiguration: {}, //アプリに適用される管理対象設定.
  //     disabled: true, // アプリの無効化.無効にしても、アプリデータは保持
  //     minimumVersionCode: 1, // デバイスで実行されるアプリの最小バージョン
  //     delegatedScopes: ["DELEGATED_SCOPE_UNSPECIFIED", "CERT_INSTALL"], // Android デバイス ポリシーから取得できる委任スコープ https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#delegatedscope
  //     managedConfigurationTemplate: {
  //       // 管理対象設定テンプレート https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#managedconfigurationtemplate
  //       templateId: "string",
  //       configurationVariables: {
  //         string: "string",
  //         // ...
  //       },
  //     },
  //     accessibleTrackIds: [
  //       //企業に属するデバイスがアクセスできるアプリのトラック ID のリスト
  //       "string",
  //     ],
  //     connectedWorkAndPersonalApp:
  //       "CONNECTED_WORK_AND_PERSONAL_APP_UNSPECIFIED", // ワークプロファイルと個人プロファイルの接続 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#connectedworkandpersonalapp
  //     autoUpdateMode: "AUTO_UPDATE_MODE_UNSPECIFIED", // 自動更新モード https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#autoupdatemode
  //     extensionConfig: {
  //       //アプリを拡張機能アプリとして有効 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#extensionconfig
  //       signingKeyFingerprintsSha256: ["string"],
  //       notificationReceiver: "string",
  //     },
  //     alwaysOnVpnLockdownExemption: "WORK_PROFILE_WIDGETS_UNSPECIFIED", // アプリが alwaysOnVpnPackage.lockdownEnabled 設定の適用対象外かどうかを制御 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#alwaysonvpnlockdownexemption
  //     workProfileWidgets: "WORK_PROFILE_WIDGETS_UNSPECIFIED", // 仕事用プロファイル アプリがホーム画面にウィジェットを追加できるかどうかを制御 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#workprofilewidgets
  //     credentialProviderPolicy: "CREDENTIAL_PROVIDER_POLICY_UNSPECIFIED", //Android 14 以降でアプリが認証情報プロバイダ https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#credentialproviderpolicy
  //     installConstraint: [
  //       // インストール制約 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#installconstraint
  //       {
  //         networkTypeConstraint: "NETWORK_TYPE_CONSTRAINT_UNSPECIFIED", //ネットワークタイプの制約　　https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#networktypeconstraint
  //         chargingConstraint: "CHARGING_CONSTRAINT_UNSPECIFIED", //充電制約　　https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#chargingconstraint
  //         deviceIdleConstraint: "DEVICE_IDLE_CONSTRAINT_UNSPECIFIED", // デバイスのアイドル制約　　https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#deviceidleconstraint
  //       },
  //     ],
  //     installPriority: 1, // インストールの優先度　　省略可。installType が次のように設定されているアプリの中で、FORCE_INSTALLED,PREINSTALLED,インストールの相対的な優先度を制御し
  //     userControlSettings: "USER_CONTROL_SETTINGS_UNSPECIFIED", // 特定のアプリに対してユーザーによる制御 //https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#usercontrolsettings
  //   },
  // ],
};
