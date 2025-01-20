import { isStrongPassword } from "validator"; // pnpm install --save @types/validator > pnpm install --save @types/validator
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "最小8文字以上で設定してください")
  .refine(
    isStrongPassword,
    "大文字、小文字、数字、記号を含む8文字以上で設定してください"
  );
export const passwordUpdateSchema = z.object({
  password: passwordSchema,
});
