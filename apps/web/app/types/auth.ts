import { z } from "zod";
import {
  passwordResetSchema,
  passwordResetVerifySchema,
  passwordUpdateSchema,
  signInSchema,
  signUpSchema,
  waitingSchema,
} from "../schemas/auth";

export type SignUp = z.infer<typeof signUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type PasswordResetVerify = z.infer<typeof passwordResetVerifySchema>;

export type Waiting = z.infer<typeof waitingSchema>;
