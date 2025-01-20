import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log("middleware-supabase-user:", user);
  // console.log("middleware-supabase-user-app_metadata:", user?.app_metadata);
  // console.log("user-organization:", user?.app_metadata?.organization);
  // console.log("user-profile:", user?.app_metadata?.hasProfile);

  // リダイレクトの処理は、app-middleware.ts に移動
  // if (
  //   !user &&
  //   !request.nextUrl.pathname.startsWith("/sign-in") &&
  //   !request.nextUrl.pathname.startsWith("/auth")
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/sign-in";
  //   return NextResponse.redirect(url);
  // }

  // return supabaseResponse;
  return {
    response: supabaseResponse,
    user,
  };
}
