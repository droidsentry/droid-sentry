import { Tables } from "@/types/database";
import { z } from "zod";

import { OnboardingUserSchema, projectSchema } from "../schemas/project";

export type ProjectWithEnterpriseRelation = Tables<"projects"> & {
  enterprise_id: string | null; //projectとenterpriseのリレーションをした場合、enterprise_nameがnullの場合がある
};

export type Project = z.infer<typeof projectSchema>;
export type OnboardingUser = z.infer<typeof OnboardingUserSchema>;
