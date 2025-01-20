import { Tables } from "@/types/database";

export type ProjectWithEnterpriseRelation = Tables<"projects"> & {
  enterprise_id: string | null; //projectとenterpriseのリレーションをした場合、enterprise_nameがnullの場合がある
};
