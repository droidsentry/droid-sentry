import { createEnrollmentToken } from "@/actions/emm/create-enrollment-token";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // URLからパラメータを取得
    const { searchParams } = new URL(request.url);
    const parent = searchParams.get("parent");
    if (!parent) {
      throw new Error("parent is required");
    }
    const qrData = await createEnrollmentToken(parent);

    // JSONデータをそのまま返す（Content-Type: application/json）
    return new NextResponse(qrData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("エラー:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
