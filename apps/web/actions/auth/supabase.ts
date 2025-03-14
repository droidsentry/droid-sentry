"use server";

import { SupabaseAuthErrorCode } from "@/lib/supabase/supabase-error-code-ja";
import { getUserContextData } from "@/lib/context/user-context";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { formatToJapaneseDateTime } from "@/lib/date-fns/get-date";
import { authErrorMessage } from "@/app/(auth)/lib/displayAuthError";
import {
  passwordResetSchema,
  passwordResetVerifySchema,
  passwordUpdateSchema,
  signInSchema,
  signUpSchema,
} from "@/app/schemas/auth";
import {
  PasswordReset,
  PasswordResetVerify,
  PasswordUpdate,
  SignIn,
  SignUp,
} from "@/app/types/auth";
import { getBaseURL } from "@/lib/base-url/client";
import { checkTotalUserLimit } from "@/lib/service";
import { redirect } from "next/navigation";

export const signUpNewUser = async (formData: SignUp) => {
  const baseUrl = getBaseURL();
  const result = await signUpSchema.safeParseAsync(formData);
  if (result.success === false) {
    console.error(result.error);
    throw new Error("フォームデータの検証に失敗しました");
  }

  await checkTotalUserLimit();

  const { username, email, password } = formData;
  // フォームデータの検証に成功した場合, Supabase にユーザー登録を行う
  const supabaseAdmin = createAdminClient();
  const now = formatToJapaneseDateTime();

  const userContextData = await getUserContextData();

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/welcome`, // メールアドレス確認後のリダイレクト先
      data: {
        username,
        created_at: now,
        ...userContextData,
      },
    },
  });

  console.error(error?.message);
  if (!user || error) {
    const errorCode = error?.code as SupabaseAuthErrorCode;
    throw new Error(await authErrorMessage(errorCode));
  }

  const currentIsoTimestamp = new Date().toISOString();
  const { error: dbError } = await supabaseAdmin.from("users").insert([
    {
      user_id: user.id,
      email,
      username,
      updated_at: currentIsoTimestamp,
    },
  ]);
  if (dbError && dbError.code !== "23505") {
    console.error(dbError.message);
    // 23505 はすでにユーザー名が登録されている場合のエラーコード
    throw new Error(
      "サインアップ登録は完了しましたが、ユーザー名の登録に失敗しました。ログインする際はユーザー名とパスワードでログインできません。"
    );
  }
  return user.id;
};

async function signInWithEmail(formData: SignIn) {
  const { emailOrUsername: email, password } = formData;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error(error.message);
    if (error.code === "invalid_credentials") {
      throw new Error("メールアドレスまたはパスワードが違います");
    }
    const errorCode = error.code as SupabaseAuthErrorCode;
    throw new Error(await authErrorMessage(errorCode));
  }
  return data;
}

async function signInWithUsername(formData: SignIn) {
  const supabaseAdmin = createAdminClient();
  const { emailOrUsername: username, password } = formData;
  const { data: user, error: dbError } = await supabaseAdmin
    .from("users")
    .select("user_id, email")
    .eq("username", username)
    .single();
  console.error(dbError?.message);
  if (!user) {
    throw new Error("ユーザー名またはパスワードが違います");
  }
  const supabase = await createClient();
  const { error: sigInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (sigInError) {
    console.error(sigInError.code);
    const errorCode = sigInError.code as SupabaseAuthErrorCode;
    throw new Error(await authErrorMessage(errorCode));
  }
}
export const signInWithEmailOrUsername = async (formData: SignIn) => {
  const safeParsedFormData = signInSchema.safeParse(formData);
  if (!safeParsedFormData.success) {
    throw new Error("フォームデータの検証に失敗しました");
  }
  // メールアドレスかユーザー名かを判断
  const isEmail = formData.emailOrUsername.includes("@");
  isEmail
    ? await signInWithEmail(safeParsedFormData.data)
    : await signInWithUsername(safeParsedFormData.data);
};

export const resendSignUpOPT = async ({
  type,
  id,
}: {
  type: "signup" | "sms";
  id: string;
}) => {
  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.admin.getUserById(id);
  if (!user) {
    console.error(
      "ユーザーが見つかりませんでした。サイン済みのユーザーが新規登録した可能性があります。",
      error?.message
    );
    return;
  }
  // OPTの再送信　https://supabase.com/docs/reference/javascript/auth-resend
  // メール認証の再送信
  if (type === "signup") {
    const email = user.email;
    if (!email) {
      throw new Error("email is required");
    }
    const baseUrl = getBaseURL();
    const { error } = await supabase.auth.resend({
      type,
      email,
      options: {
        emailRedirectTo: `${baseUrl}/welcome`, // メールアドレス確認後のリダイレクト先
      },
    });
    if (error) {
      console.error(error.message);
      const errorCode = error.code as SupabaseAuthErrorCode;
      throw new Error(await authErrorMessage(errorCode));
    }
  }
  // SMS認証の再送信
  if (type === "sms") {
    const phone = user.phone;
    if (!phone) {
      throw new Error("phone is required");
    }
    const { error } = await supabase.auth.resend({
      type,
      phone,
    });
    console.error(error?.message);
    if (error) {
      console.error(error.message);
      const errorCode = error.code as SupabaseAuthErrorCode;
      throw new Error(await authErrorMessage(errorCode));
    }
  }
  return { message: "再送の処理に成功しました。" };
};

export const resendAuthChangeOPT = async ({
  type,
  email,
  phone,
}: {
  type: "email_change" | "phone_change";
  email?: string;
  phone?: string;
}) => {
  const supabase = await createClient();
  if (type === "email_change" && email) {
    const { error } = await supabase.auth.resend({
      type,
      email,
    });
    if (error) {
      console.error(error.message);
      const errorCode = error.code as SupabaseAuthErrorCode;
      throw new Error(await authErrorMessage(errorCode));
    }
  }
  if (type === "phone_change" && phone) {
    const { error } = await supabase.auth.resend({
      type,
      phone,
    });
    if (error) {
      console.error(error.message);
      const errorCode = error.code as SupabaseAuthErrorCode;
      throw new Error(await authErrorMessage(errorCode));
    }
  }
  return { message: "再送の処理に成功しました。" };
};

export async function resetPassword(formData: PasswordReset) {
  const result = await passwordResetSchema.safeParseAsync(formData);
  if (result.success === false) {
    console.error(result.error);
    throw new Error("フォームデータの検証に失敗しました");
  }
  const { email } = formData;
  const baseUrl = getBaseURL();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/update-password`, // パスワードリセット後のリダイレクト先
  });
  if (error) {
    console.error(error.message);
    const errorCode = error.code as SupabaseAuthErrorCode;
    throw new Error(await authErrorMessage(errorCode));
  }
  // return { message: "ご登録のメールアドレスに確認メールを送信しました。" };
  // return redirect("/password-reset/verify");
}

export async function resetPasswordVerify(formData: PasswordResetVerify) {
  const result = await passwordResetVerifySchema.safeParseAsync(formData);
  if (result.success === false) {
    console.error(result.error);
    throw new Error("フォームデータの検証に失敗しました");
  }

  const { email, pin: token } = formData;
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) {
    console.error(error.message);
    const errorCode = error.code as SupabaseAuthErrorCode;
    throw new Error(await authErrorMessage(errorCode));
  }
}

export async function updatePassword(formData: PasswordUpdate) {
  const result = await passwordUpdateSchema.safeParseAsync(formData);
  if (result.success === false) {
    console.error(result.error);
    throw new Error("フォームデータの検証に失敗しました");
  }
  const { password } = formData;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password,
  });
  if (error) {
    console.error(error.message);
    const errorCode = error.code as SupabaseAuthErrorCode;
    throw new Error(await authErrorMessage(errorCode));
  }
}

export const signWithGithub = async () => {
  const baseUrl = getBaseURL();
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${baseUrl}/api/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export const signWithGoogle = async () => {
  const baseUrl = getBaseURL();
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/api/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export const signWithDiscord = async () => {
  const baseUrl = getBaseURL();
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${baseUrl}/api/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};
