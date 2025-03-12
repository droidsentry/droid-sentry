import { NextResponse } from "next/server";
import DroidSentryWaitingNotificationEmail from "./waiting-notification";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const body = await request.json();
    const {
      username,
      projectName,
      queuePosition,
      estimatedTime,
      ip_address,
      createdAt,
      location,
      email, // 送信先メールアドレス
    } = body;

    // 必須パラメータのバリデーション
    if (!username || !projectName || !email) {
      return NextResponse.json(
        { error: "必須パラメータが不足しています" },
        { status: 400 }
      );
    }

    // メール送信
    const { data, error } = await resend.emails.send({
      from: "DroidSentry <noreply@myemm-next.online>",
      to: [email],
      subject: `${projectName}の順番待ち登録完了のお知らせ`,
      react: DroidSentryWaitingNotificationEmail({
        username,
        projectName,
        queuePosition: queuePosition || "未定",
        estimatedTime: estimatedTime || "未定",
        ip_address: ip_address || "不明",
        createdAt: createdAt || new Date().toLocaleString("ja-JP"),
        location: location || "不明",
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: "メール送信中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
