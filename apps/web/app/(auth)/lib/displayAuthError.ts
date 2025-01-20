import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import {
  getSupabaseAuthErrorMessage,
  SupabaseAuthErrorCode,
} from "../../../lib/supabase/supabase-error-code-ja";

export const authErrorMessage = async (
  errorCode: SupabaseAuthErrorCode
): Promise<string> => {
  const errorMessage = await getSupabaseAuthErrorMessage(errorCode);
  if (errorMessage) {
    return errorMessage;
  } else {
    return `
      未知のエラーが発生しました。
      システム管理者に連絡してください。
      code: ${errorCode}
      日時: ${formatToJapaneseDateTime()}`;
  }
};
