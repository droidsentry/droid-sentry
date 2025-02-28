import { AppConfig } from "@/app.config";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container mx-auto prose pt-8 pb-10 px-6 sm:px-0 prose-table:text-sm prose-th:w-1/2 dark:prose-invert">
      <h1>特定商法取引法に基づく表示</h1>
      <table>
        <tbody>
          <tr>
            <th>事業者</th>
            <td>請求をいただければ遅延なく開示します。</td>
          </tr>
          <tr>
            <th>住所</th>
            <td>同上</td>
          </tr>
          <tr>
            <th>電話番号</th>
            <td>同上</td>
          </tr>
          <tr>
            <th>事業者</th>
            <td>{AppConfig.email}</td>
          </tr>
          <tr>
            <th>役務の対価</th>
            <td>各サービスの申込ページに表示</td>
          </tr>
          <tr>
            <th>対価以外に必要となる費用</th>
            <td>
              なし（但し、インターネット接続料金その他の電気通信回線の通信に関する費用及び通信機器はユーザーにて負担して頂きます）。
            </td>
          </tr>
          <tr>
            <th>代金の支払方法</th>
            <td>クレジットカード決済</td>
          </tr>
          <tr>
            <th>代金の支払時期</th>
            <td>各サービスの申込時に入力したクレジットカードに課金します。</td>
          </tr>
          <tr>
            <th>役務の提供時期</th>
            <td>即時</td>
          </tr>
          <tr>
            <th>キャンセル（返品・交換/返品特約）</th>
            <td>申込後のキャンセルはできません。</td>
          </tr>
          <tr>
            <th>対応機種</th>
            <td>
              Google モバイル
              サービス（GMS）のライセンス登録されたAndroid7以上のデバイス、かつ、Googleにより
              <Link
                href="https://androidenterprisepartners.withgoogle.com/devices"
                className="text-primary"
              >
                推奨されているデバイス
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
