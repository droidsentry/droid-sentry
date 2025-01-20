drop policy "Enable read access for all users" on "public"."apps";

create table "public"."pubsub_logs" (
    "id" uuid not null default gen_random_uuid(),
    "message_id" text not null,
    "attributes_data" jsonb not null,
    "message_data" jsonb not null,
    "publish_time" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."pubsub_logs" enable row level security;

alter table "public"."apps" add column "app_type" text not null;

alter table "public"."apps" alter column "updated_at" set not null;

alter table "public"."devices" add column "command_config_data" jsonb;

alter table "public"."devices" alter column "updated_at" drop default;

alter table "public"."enterprises" alter column "updated_at" drop default;

CREATE UNIQUE INDEX pubsub_logs_pkey ON public.pubsub_logs USING btree (id);

alter table "public"."pubsub_logs" add constraint "pubsub_logs_pkey" PRIMARY KEY using index "pubsub_logs_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_project_user(project_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_members.project_id = is_project_user.project_id
    AND project_members.user_id = (select auth.uid())
  );
END;$function$
;

grant delete on table "public"."pubsub_logs" to "anon";

grant insert on table "public"."pubsub_logs" to "anon";

grant references on table "public"."pubsub_logs" to "anon";

grant select on table "public"."pubsub_logs" to "anon";

grant trigger on table "public"."pubsub_logs" to "anon";

grant truncate on table "public"."pubsub_logs" to "anon";

grant update on table "public"."pubsub_logs" to "anon";

grant delete on table "public"."pubsub_logs" to "authenticated";

grant insert on table "public"."pubsub_logs" to "authenticated";

grant references on table "public"."pubsub_logs" to "authenticated";

grant select on table "public"."pubsub_logs" to "authenticated";

grant trigger on table "public"."pubsub_logs" to "authenticated";

grant truncate on table "public"."pubsub_logs" to "authenticated";

grant update on table "public"."pubsub_logs" to "authenticated";

grant delete on table "public"."pubsub_logs" to "service_role";

grant insert on table "public"."pubsub_logs" to "service_role";

grant references on table "public"."pubsub_logs" to "service_role";

grant select on table "public"."pubsub_logs" to "service_role";

grant trigger on table "public"."pubsub_logs" to "service_role";

grant truncate on table "public"."pubsub_logs" to "service_role";

grant update on table "public"."pubsub_logs" to "service_role";

create policy "Enable read access for authenticated users only"
on "public"."apps"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."pubsub_logs"
as permissive
for insert
to authenticated
with check (true);




