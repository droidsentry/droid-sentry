import { z } from "zod";
import {
  awesomeDebounceWaitingUserSchema,
  waitingUserSchema,
} from "../schemas/waiting";

export type WaitingUser = z.infer<typeof waitingUserSchema>;
