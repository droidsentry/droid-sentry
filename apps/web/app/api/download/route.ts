import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const appId = searchParams.get("appId");

  if (!appId) {
    return new NextResponse("App id is required", { status: 400 });
  }

  try {
    const supabase = await createClient();
    // const { data: user, error: userError } = await supabase.auth.getUser();
    // if (userError) {
    //   return new NextResponse("User not found", { status: 404 });
    // }

    const { data, error } = await supabase
      .from("apps")
      .select("app_data")
      .eq("app_id", appId)
      .single();

    if (error || !data) {
      return new NextResponse("App not found", { status: 404 });
    }

    const jsonString = JSON.stringify(data.app_data, null, 2);
    const date = formatToJapaneseDateTime(new Date(), "yyyy_MMdd_HHmmss");

    console.log("date", date);
    const fileName = `${appId}_appData_${date}.json`;

    const headers = new Headers({
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });

    return new NextResponse(jsonString, { headers });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
