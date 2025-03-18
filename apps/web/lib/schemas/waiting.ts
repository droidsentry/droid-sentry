import AwesomeDebouncePromise from "awesome-debounce-promise";
import { z } from "zod";
import {
  isWaitingUserEamilUnique,
  isWaitingUsernameUnique,
} from "../actions/waiting";

export const waitingUsernameSchnema = z
  .string()
  .min(1, "ユーザー名を入力してください")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "ユーザー名には英数字、アンダースコア(_)、ハイフン(-)のみ使用できます"
  )
  .refine((userName) => isWaitingUsernameUnique(userName));

export const awesomeDebounceWaitingUsernameSchnema = z
  .string()
  .min(1, "ユーザー名を入力してください")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "ユーザー名には英数字、アンダースコア(_)、ハイフン(-)のみ使用できます"
  )
  .refine(
    AwesomeDebouncePromise(
      async (userName) => await isWaitingUsernameUnique(userName),
      800
    ),
    {
      message: "このユーザー名は既に使用されています",
    }
  );

export const waitingEmailSchema = z
  .string()
  .trim()
  .min(1, {
    message: "メールアドレスを入力してください。",
  })
  .email({
    message: "メールアドレスの形式で入力してください。",
  })
  .max(254, {
    message: "最大254文字までです。",
  })
  .refine((email) => isWaitingUserEamilUnique(email), {
    message: "このメールアドレスは既に登録されています",
  });

export const awesomeDebounceWaitingEmailSchema = z
  .string()
  .trim()
  .min(1, {
    message: "メールアドレスを入力してください。",
  })
  .email({
    message: "メールアドレスの形式で入力してください。",
  })
  .max(254, {
    message: "最大254文字までです。",
  })
  .refine(
    AwesomeDebouncePromise(
      async (email: string) => await isWaitingUserEamilUnique(email),
      800
    ),
    {
      message: "このメールアドレスは既に登録されています",
    }
  );

export const waitingUserSchema = z.object({
  email: waitingEmailSchema,
  username: waitingUsernameSchnema,
});

export const awesomeDebounceWaitingUserSchema = waitingUserSchema.extend({
  email: awesomeDebounceWaitingEmailSchema,
  username: awesomeDebounceWaitingUsernameSchnema,
});
// ルートハンドラに渡し、メールを送信する送信するためのスキーマ
export const sendEmailToWaitingUserSchema = z.object({
  username: waitingUsernameSchnema,
  email: waitingEmailSchema,
  ip_address: z.string(),
  createdAt: z.string(),
  location: z.string(),
});
