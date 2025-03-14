import { User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// 誰でもアクセスできるパス
const publicRoutes = [
  "/",
  "/error",
  "/auth-error",
  "/terms",
  "/privacy",
  "/legal",
  "/api/auth/callback",
  "/api/auth/confirm",
  "/api/auth/route",
  "/waiting",
];

// ゲスト専用ルート(ログインしている人はアクセスできない)
const guestRoutes = [
  "/sign-in",
  "/sign-up",
  "/sign-up/form-client",
  "/sign-up/form-server",
  "/sign-in-anonymous",
  "/sign-up/verify-email-address",
  "/password-reset",
  "/password-reset/verify",
];

export default async function AppMiddleware(
  request: NextRequest,
  response: NextResponse,
  user: User | null
) {
  // リクエストのパスを取得
  const path = request.nextUrl.pathname;
  // ユーザーがサインインしているかどうかを確認.サインインしていれば、true.
  const signedIn = Boolean(user);
  // パスがパブリックルートかどうかを確認.パブリックルートであれば、true.
  const isPublicRoute = publicRoutes.includes(path);
  // パスがゲスト専用ルートかどうかを確認.ゲスト専用ルートであれば、true.
  const isGuestRoute = guestRoutes.includes(path);
  // パスがプライベートルートかどうかを確認.プライベートルートであれば、true.
  const isPrivateRoute = !isPublicRoute && !isGuestRoute;
  // ユーザーがプロジェクトを作成しているかどうかを確認
  const isOnboardingCompleted = user?.user_metadata?.is_onboarding_completed;
  // // ユーザーがサインアップした時点で最大ユーザー数に達しているかどうかを確認　。超えていない場合はtrue
  // const hasPassedUserLimitCheck =
  //   user?.app_metadata?.has_passed_user_limit_check;

  // // ユーザーが所属する組織があるかどうかを確認
  // const hasOrganization = user?.app_metadata?.organization;
  // // ユーザーがプロフィールを持っているかどうかを確認
  // const hasProfile = user?.app_metadata?.hasProfile;

  // ゲスト専用ルートにサインイン済みのユーザーがアクセスしようとした場合、emmページにリダイレクト
  if (isGuestRoute && signedIn) {
    return NextResponse.redirect(new URL(`/projects`, request.url));
  }

  if (isPrivateRoute) {
    // サインインしていない場合、ログインページにリダイレクト
    if (!signedIn) {
      return NextResponse.redirect(
        new URL(`/sign-in?from=${path}`, request.url)
      );
    }
    // 最大ユーザー数に達している場合、サインアップページにリダイレクト
    // if (!hasPassedUserLimitCheck && path !== `/waiting`) {
    //   return NextResponse.redirect(new URL("/waiting", request.url));
    // }
    // プロジェクト作成チェック（/welcome以外のプライベートルートの場合のみ）
    if (!isOnboardingCompleted && path !== `/welcome`) {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }

    // プロフィールを持っていない場合、プロフィール登録ページにリダイレクト
    // if (!hasProfile) {
    //   return NextResponse.redirect(new URL(`/register/profile`, request.url));
    // }

    // プロフィールを持っているが組織に所属していない場合、組織作成ページにリダイレクト
    // if (hasProfile && !hasOrganization && path !== "/organization/new") {
    //   return NextResponse.redirect(new URL(`/organization/new`, request.url));
    // }
  }

  // 何もリダイレクトが発生しない場合、元のレスポンスを返す
  return response;
}
