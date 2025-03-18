import { NextResponse } from "next/server";
import DroidSentryWaitingNotificationEmail from "./waiting-notification";
import { Resend } from "resend";
import { AppConfig } from "@/app.config";
import { sendEmailToWaitingUserSchema } from "@/lib/schemas/waiting";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = sendEmailToWaitingUserSchema.parse(body);
    const { username, email, ip_address, createdAt, location } = parsedBody;
    const projectName = AppConfig.title;

    // 必須パラメータのバリデーション
    if (!username || !email) {
      return NextResponse.json(
        { error: "必須パラメータが不足しています" },
        { status: 400 }
      );
    }
    //
    const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
    const emailDomain = process.env.RESEND_EMAIL_ADDRESS_DOMAIN;
    const from = isProd
      ? `【${projectName}】 <noreply@${emailDomain}>`
      : `【${projectName} DEV】 <noreply@${emailDomain}>`;

    // メール送信
    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject: `【${projectName}】の順番待ち登録完了のお知らせ`,
      react: DroidSentryWaitingNotificationEmail({
        username,
        projectName,
        ip_address,
        createdAt,
        location,
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
