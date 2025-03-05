import { isStrongPassword } from "validator";
import { z } from "zod";
import { emailSchema } from "./devices";
import { isUserNameUnique } from "@/actions/auth/sign-up";
import AwesomeDebouncePromise from "awesome-debounce-promise";

const passwordSchema = z
  .string()
  .trim()
  .min(8, "最小8文字以上で設定してください")
  .refine(
    isStrongPassword,
    "大文字、小文字、数字、記号を含む8文字以上で設定してください"
  );

export const passwordUpdateSchema = z.object({
  password: passwordSchema,
});
export const passwordResetSchema = z.object({
  email: emailSchema,
});
export const passwordResetVerifySchema = z.object({
  pin: z.string().min(6, "6桁の認証コードを入力してください"),
  email: emailSchema,
});
export const signInSchema = z.object({
  emailOrUsername: z.string().trim().min(1).max(254),
  password: z.string().trim().min(8).refine(isStrongPassword),
});
// .brand<"SignIn">();
export const signUpSchema = z.object({
  username: z
    .string()
    .trim() // 先頭と末尾の空白を削除
    .min(4, "ユーザー名は4文字以上で設定してください")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "ユーザー名には英数字、アンダースコア(_)、ハイフン(-)のみ使用できます"
    )
    .refine((userName) => isUserNameUnique(userName)),
  email: emailSchema,
  password: passwordSchema,
});

// 短期間にリクエストが連続して送信されないようにする
export const extendedSignUpSchema = signUpSchema.extend({
  username: z
    .string()
    .trim()
    .min(1, "ユーザー名を入力してください")
    .refine(
      AwesomeDebouncePromise(
        async (userName) => await isUserNameUnique(userName),
        800
      ),
      {
        message: "このユーザー名は既に使用されています",
      }
    ),
});
