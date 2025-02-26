alter table "public"."project_members" drop constraint "project_members_user_id_fkey";

alter table "public"."project_members" alter column "user_id" set not null;

alter table "public"."project_members" add constraint "project_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."project_members" validate constraint "project_members_user_id_fkey";



