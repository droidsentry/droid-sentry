import { Policy } from "@/app/types/policy";

// export const defaultPolicyRequestBody: AndroidManagementPolicy = {
export const defaultPolicyRequestBody: Policy = {
  // request body parameters
  // https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#PlayStoreMode

  //   "accountTypesWithManagementDisabled": [],//ユーザーが管理できないアカウントの種類
  //   "addUserDisabled": false, // 新しいユーザーとプロファイルの追加が無効になっているかどうか.managementMode が DEVICE_OWNER のデバイスでは、このフィールドは無視され、ユーザーはユーザーの追加や削除を許可されません。
  //   "adjustVolumeDisabled": false, // 音量調整の無効化
  advancedSecurityOverrides: {
    // 高度なセキュリティ設定 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#advancedsecurityoverrides
    untrustedAppsPolicy: "ALLOW_INSTALL_DEVICE_WIDE", // 信頼できないアプリ（提供元不明のアプリ）の許可 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#untrustedappspolicy
    // googlePlayProtectVerifyApps: "GOOGLE_PLAY_PROTECT_VERIFY_APPS_UNSPECIFIED", //Google Play プロテクトの適用設定　　https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#googleplayprotectverifyapps
    developerSettings: "DEVELOPER_SETTINGS_ALLOWED", //開発者向け設定（開発者向けオプションとセーフブート）へのアクセス https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#developersettings
    // commonCriteriaMode: "COMMON_CRITERIA_MODE_UNSPECIFIED", // 一般基準モード https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#commoncriteriamode
    // personalAppsThatCanReadWorkNotifications: [], // 個人アプリが会社の通知を読み取ることを許可
    // mtePolicy: "MTE_POLICY_UNSPECIFIED", // デバイスの Memory Tagging Extension（MTE） を制御します。MTE ポリシーの変更を適用するには、デバイスを再起動する必要　　https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#mtepolicy
    // contentProtectionPolicy: "CONTENT_PROTECTION_POLICY_UNSPECIFIED", // コンテンツ保護（虚偽のアプリをスキャンする機能）を許可 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#contentprotectionpolicy
  }, // 開発者設定を許可
  //   "alwaysOnVpnPackage": {},
  //   "androidDevicePolicyTracks": [],
  //   "applications": [],
  //   "autoDateAndTimeZone": "my_autoDateAndTimeZone",
  //   "autoTimeRequired": false,
  //   "blockApplicationsEnabled": false,
  //   "bluetoothConfigDisabled": false, // Bluetooth設定の無効化
  //   "bluetoothContactSharingDisabled": false, // Bluetooth連絡先共有の無効化
  bluetoothConfigDisabled: false, // Bluetooth設定の無効化
  cameraDisabled: false, // カメラ無効化
  //   "cellBroadcastsConfigDisabled": false, // 緊急速報メールの設定が無効
  //   "choosePrivateKeyRules": [],
  //   "complianceRules": [],
  //   "createWindowsDisabled": false, // アプリ　ウィンドウ以外のウィンドウの作成無効化
  //   "credentialsConfigDisabled": false, // ユーザー認証情報の設定の無効化
  //   "crossProfilePolicies": {},
  //   "dataRoamingDisabled": false,
  //   "debuggingFeaturesAllowed": false,
  //   "defaultPermissionPolicy": "PROMPT",　// アプリへの権限付与のリクエストに関するポリシー https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#permissionpolicy
  //   "deviceOwnerLockScreenInfo": {},
  //   "encryptionPolicy": "ENCRYPTION_POLICY_UNSPECIFIED", // 暗号化のタイプ
  //   "factoryResetDisabled": false, // ファクトリーリセットの無効化
  //   "frpAdminEmails": [],
  //   "funDisabled": false,　//設定のイースター エッグ ゲームの制御
  //   "installAppsDisabled": false, // アプリのインストールの無効化
  //   "installUnknownSourcesAllowed": false,
  //   "keyguardDisabled": false, // プライマリ ディスプレイまたはセカンダリ ディスプレイのロック画面が無効になります。このポリシーは、専用デバイス管理モードでのみサポート
  //   "keyguardDisabledFeatures": [], // 無効にできるキーガード機能
  //   "kioskCustomLauncherEnabled": false, //キオスク カスタム ランチャーの有効化
  //   "kioskCustomization": {},
  locationMode: "LOCATION_ENFORCED", // 位置情報モード
  //   "longSupportMessage":  { localizedMessages: {}, defaultMessage: "" },　// デバイス管理者の設定画面にユーザーに表示されるメッセージ。
  //   "maximumTimeToLock": "my_maximumTimeToLock",
  //   "minimumApiLevel": 0, // 許可される最小 Android API レベル。
  //   "mobileNetworksConfigDisabled": false, // モバイルネットワーク設定の無効化
  modifyAccountsDisabled: false, // アカウントの変更を無効化 //
  mountPhysicalMediaDisabled: false, // 物理メディアのマウントを無効化
  //   "name": "my_name",
  //   "networkEscapeHatchEnabled": false, //一時的なネットワーク化
  //   "networkResetDisabled": false,　 // ネットワークリセットの無効化
  //   "oncCertificateProviders": [],
  //   "openNetworkConfiguration": {},
  //   "outgoingBeamDisabled": false, // NFC を使用してアプリからデータをビームで送信することを無効化
  //   "outgoingCallsDisabled": false, // 送信通話の無効化
  //   "passwordPolicies": [],
  //   "passwordRequirements": {},
  //   "permissionGrants": [],
  //   "permittedAccessibilityServices": {},
  //   "permittedInputMethods": {},
  //   "persistentPreferredActivities": [],
  //   "personalUsagePolicies": {},
  playStoreMode: "PLAY_STORE_MODE_UNSPECIFIED", // Google Play ストア モード ポリシーに指定できる値。
  //   "policyEnforcementRules": [],
  //   "privateKeySelectionEnabled": false,
  //   "recommendedGlobalProxy": {},
  //   "removeUserDisabled": false,　// ユーザー削除の無効化
  screenCaptureDisabled: false, // 画面キャプチャの無効化
  //   "setUserIconDisabled": false,
  //   "setWallpaperDisabled": false,
  //   "setupActions": [],
  //   "shareLocationDisabled": false,　// 位置情報共有の無効化　　完全管理対象デバイスと個人所有の仕事用プロファイルの両方でサポート
  // shortSupportMessage: { localizedMessages: {}, defaultMessage: "" },　// ショートサポートメッセージ。管理者によって機能が無効になっている設定画面で、ユーザーに表示されるメッセージ。メッセージが 200 文字を超える場合は、切り捨てられることがあります。
  //   "skipFirstUseHintsEnabled": false,　// 初回使用ヒントのスキップ化
  //   "smsDisabled": false,　// SMSの無効化　  // 秘密鍵選択の無効化
  //   "statusBarDisabled": false,
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
  //   "stayOnPluggedModes": [],
  //   "systemUpdate": {},
  //   "tetheringConfigDisabled": false,
  //   "uninstallAppsDisabled": false,　 // アプリのアンインストールの無効化.applications を使用して削除されたアプリであっても、アプリがアンインストールされなくなります。
  //   "usbMassStorageEnabled": false,
  //   "version": "my_version",
  //   "vpnConfigDisabled": false, // VPN設定の無効化
  //   "wifiConfigsLockdownEnabled": false
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
  // microphoneAccess: "MICROPHONE_ACCESS_ALLOWED", // マイクアクセスの許可 https://developers.google.com/android/management/reference/rest/v1/enterprises.policies?hl=ja#microphoneaccess
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
