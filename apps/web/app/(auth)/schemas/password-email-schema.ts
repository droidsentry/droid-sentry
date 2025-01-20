import { isStrongPassword } from "validator"; // pnpm install --save @types/validator > pnpm install --save @types/validator
import { z } from "zod";

export const passwordSchema = z
  .string()
  .trim()
  .min(8, "最小8文字以上で設定してください")
  .refine(
    isStrongPassword,
    "大文字、小文字、数字、記号を含む8文字以上で設定してください"
  );
export const emailOrUsernameSchema = z.object({
  emailOrUserName: z.string().trim().min(1, "メールアドレスを入力してください"),
  password: passwordSchema,
});
