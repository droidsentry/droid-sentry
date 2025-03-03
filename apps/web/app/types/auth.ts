import { z } from "zod";
import {
  passwordResetSchema,
  passwordUpdateSchema,
  signInSchema,
  signUpSchema,
} from "../schema/auth";

export type SignUp = z.infer<typeof signUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
