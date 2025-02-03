export const deviceInfoData = {
  name: "enterprises/LC0283n6ru/devices/34e64c3442105d71",
  state: "ACTIVE",
  apiLevel: 31,
  userName: "enterprises/LC0283n6ru/users/112597578258069556620",
  ownership: "COMPANY_OWNED",
  policyName: "enterprises/LC0283n6ru/policies/default",
  appliedState: "ACTIVE",
  enrollmentTime: "2025-01-23T11:21:05.695Z",
  managementMode: "DEVICE_OWNER",
  systemProperties: {
    "ro.product.first_api_level": "28",
  },
  enrollmentTokenName:
    "enterprises/LC0283n6ru/enrollmentTokens/fNPoYra5MsBARQrW_UbYZdrfrhlhSwxvj-q1ULE4yIE",
  lastStatusReportTime: "2025-01-28T23:52:34.924Z",
  disabledReason: null,
  previousDeviceNames: [
    "enterprises/LC0283n6ru/devices/3fa896bf43eb10ed",
    "enterprises/LC0283n6ru/devices/37d4a14c5af5eae5",
    "enterprises/LC0283n6ru/devices/33cea54c9ea32d86",
    "enterprises/LC0283n6ru/devices/3d6879b805801220",
    "enterprises/LC0283n6ru/devices/3fc5223471902af8",
    "enterprises/LC0283n6ru/devices/3a39dab4e38a6bea",
    "enterprises/LC0283n6ru/devices/3274a2b94288caeb",
    "enterprises/LC0283n6ru/devices/3dddfe1a76fb9492",
  ],
};

export const hardwareInfoItems = [
  {
    label: "name",
    title: "デバイスID",
    explanation: "デバイスを管理するID",
  },
  {
    label: "userName",
    title: "ユーザーID",
    explanation: "デバイスに自動で設定されたユーザーを管理するID",
  },
  {
    label: "state",
    title: "デバイスにリクエストされている状態",
    explanation: "デバイスが無効化されている場合、「無効」と表示されます。",
  },
  {
    label: "appliedState",
    title: "デバイスに適用されている状態",
    explanation: "現在、デバイスに適用されている状態。",
  },
  {
    label: "enrollmentTime",
    title: "登録日時",
    explanation: "デバイスが管理された日時。",
  },
  {
    label: "ownership",
    title: "所有権",
    explanation: "デバイスの所有権",
  },
  {
    label: "managementMode",
    title: "管理モード",
    explanation:
      "デバイスで使用されている管理モード。各モードにより、デバイスに設定できるポリシーが制限されます。",
  },
  {
    label: "systemProperties",
    title: "システムプロパティ",
    explanation: "デバイスのシステムプロパティ情報。",
  },
  {
    label: "previousDeviceNames",
    title: "過去のデバイス名",
    explanation:
      "デバイスの過去のデバイス名。端末のシリアル番号を使用し、以前に使用されていたかを判断します。",
  },
];
