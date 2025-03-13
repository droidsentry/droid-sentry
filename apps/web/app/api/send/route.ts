import { NextResponse } from "next/server";
import DroidSentryWaitingNotificationEmail from "./waiting-notification";
import { Resend } from "resend";
import { AppConfig } from "@/app.config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    console.log("send waiting notification");
    console.log(request);
    console.log(request.body);
    // リクエストボディからデータを取得
    const body = await request.json();
    console.log(body);
    const {
      username,
      projectName = AppConfig.title,
      ip_address,
      createdAt,
      location,
      email,
    } = body;

    // 必須パラメータのバリデーション
    if (!username || !email) {
      return NextResponse.json(
        { error: "必須パラメータが不足しています" },
        { status: 400 }
      );
    }
    //
    const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
    const emailDomain = process.env.RESEND_Email_ADDRESS_DOMAIN;
    const from = isProd
      ? `【${projectName}】 <noreply@${emailDomain}>`
      : `【${projectName} DEV】 <noreply@${emailDomain}>`;
    console.log(from);

    // メール送信
    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject: `【${projectName}】の順番待ち登録完了のお知らせ`,
      react: DroidSentryWaitingNotificationEmail({
        username,
        projectName,
        ip_address: ip_address || "不明",
        createdAt: createdAt || new Date().toLocaleString("ja-JP"),
        location: location || "不明",
      }),
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "メール送信中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
