import { z } from "zod";
import { signUpFormSchema } from "../schema/auth";

export type SignUpForm = z.infer<typeof signUpFormSchema>;
