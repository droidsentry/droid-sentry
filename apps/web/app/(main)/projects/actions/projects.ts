"use server";

import { createClient } from "@/lib/supabase/server";

export const deleteProject = async (projectId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("project_id", projectId);
  if (error) {
    console.error("Error deleting project:", error);
    throw new Error("Error deleting project");
  }
  // revalidatePath("/dashboard"); //
};
