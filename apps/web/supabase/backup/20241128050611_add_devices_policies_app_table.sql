-- alter table "public"."enterprise_settings_history" drop constraint "enterprise_settings_history_enterprise_id_fkey";

-- alter table "public"."projects" drop constraint "projects_enterprise_id_fkey";

create table "public"."application_reports" (
    "id" uuid not null default gen_random_uuid(),
    "device_table_id" uuid not null,
    "data" jsonb not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."application_reports" enable row level security;

create table "public"."apps" (
    "id" uuid not null default gen_random_uuid(),
    "enterprise_table_id" uuid not null,
    "name" text not null,
    "app_details" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone
);


alter table "public"."apps" enable row level security;

create table "public"."devices" (
    "id" uuid not null default gen_random_uuid(),
    "enterprise_table_id" uuid not null,
    "policy_table_id" uuid,
    "display_name" text not null,
    "device_name" text not null,
    "device_config_data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "policy_name" text
);


alter table "public"."devices" enable row level security;

create table "public"."memory_events" (
    "id" uuid not null default gen_random_uuid(),
    "device_table_id" uuid not null,
    "data" jsonb not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."memory_events" enable row level security;

create table "public"."policies" (
    "id" uuid not null default gen_random_uuid(),
    "enterprise_table_id" uuid not null default gen_random_uuid(),
    "policy_name" text not null,
    "display_name" text,
    "policy_config_data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."policies" enable row level security;

create table "public"."power_manegement_events" (
    "id" uuid not null default gen_random_uuid(),
    "device_table_id" uuid not null,
    "data" jsonb not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."power_manegement_events" enable row level security;

alter table "public"."enterprises" drop column "enterprise_token";

alter table "public"."enterprises" drop column "signup_url_name";

alter table "public"."enterprises" drop column "status";

alter table "public"."enterprises" add column "data" jsonb not null;

alter table "public"."enterprises" add column "owner_id" uuid;

alter table "public"."enterprises" alter column "enterprise_name" set not null;

alter table "public"."projects" drop column "enterprise_id";

alter table "public"."projects" drop column "updatee_at";

alter table "public"."projects" add column "enterprise_table_id" uuid;

alter table "public"."projects" add column "updated_at" timestamp with time zone not null default now();

CREATE UNIQUE INDEX application__pkey ON public.application_reports USING btree (id);

CREATE UNIQUE INDEX apps_name_key ON public.apps USING btree (name);

CREATE UNIQUE INDEX apps_pkey ON public.apps USING btree (id);

CREATE UNIQUE INDEX devices_device_name_key ON public.devices USING btree (device_name);

CREATE UNIQUE INDEX devices_pkey ON public.devices USING btree (id);

CREATE UNIQUE INDEX enterprises_enterprise_name_key ON public.enterprises USING btree (enterprise_name);

CREATE UNIQUE INDEX memory_events_pkey ON public.memory_events USING btree (id);

CREATE UNIQUE INDEX policies_pkey ON public.policies USING btree (id);

CREATE UNIQUE INDEX policies_policy_name_key ON public.policies USING btree (policy_name);

CREATE UNIQUE INDEX power_manegement_events_pkey ON public.power_manegement_events USING btree (id);

alter table "public"."application_reports" add constraint "application__pkey" PRIMARY KEY using index "application__pkey";

alter table "public"."apps" add constraint "apps_pkey" PRIMARY KEY using index "apps_pkey";

alter table "public"."devices" add constraint "devices_pkey" PRIMARY KEY using index "devices_pkey";

alter table "public"."memory_events" add constraint "memory_events_pkey" PRIMARY KEY using index "memory_events_pkey";

alter table "public"."policies" add constraint "policies_pkey" PRIMARY KEY using index "policies_pkey";

alter table "public"."power_manegement_events" add constraint "power_manegement_events_pkey" PRIMARY KEY using index "power_manegement_events_pkey";

alter table "public"."application_reports" add constraint "application_reports_device_table_id_fkey" FOREIGN KEY (device_table_id) REFERENCES devices(id) ON DELETE CASCADE not valid;

alter table "public"."application_reports" validate constraint "application_reports_device_table_id_fkey";

alter table "public"."apps" add constraint "apps_enterprise_table_id_fkey" FOREIGN KEY (enterprise_table_id) REFERENCES enterprises(id) ON DELETE CASCADE not valid;

alter table "public"."apps" validate constraint "apps_enterprise_table_id_fkey";

alter table "public"."apps" add constraint "apps_name_key" UNIQUE using index "apps_name_key";

alter table "public"."devices" add constraint "devices_device_name_key" UNIQUE using index "devices_device_name_key";

alter table "public"."devices" add constraint "devices_enterprise_table_id_fkey" FOREIGN KEY (enterprise_table_id) REFERENCES enterprises(id) ON DELETE CASCADE not valid;

alter table "public"."devices" validate constraint "devices_enterprise_table_id_fkey";

alter table "public"."devices" add constraint "devices_policy_table_id_fkey" FOREIGN KEY (policy_table_id) REFERENCES policies(id) not valid;

alter table "public"."devices" validate constraint "devices_policy_table_id_fkey";

alter table "public"."enterprises" add constraint "enterprises_enterprise_name_key" UNIQUE using index "enterprises_enterprise_name_key";

alter table "public"."memory_events" add constraint "memory_events_device_table_id_fkey" FOREIGN KEY (device_table_id) REFERENCES devices(id) ON DELETE CASCADE not valid;

alter table "public"."memory_events" validate constraint "memory_events_device_table_id_fkey";

alter table "public"."policies" add constraint "policies_enterprise_table_id_fkey" FOREIGN KEY (enterprise_table_id) REFERENCES enterprises(id) ON DELETE CASCADE not valid;

alter table "public"."policies" validate constraint "policies_enterprise_table_id_fkey";

alter table "public"."policies" add constraint "policies_policy_name_key" UNIQUE using index "policies_policy_name_key";

alter table "public"."power_manegement_events" add constraint "power_manegement_events_device_table_id_fkey" FOREIGN KEY (device_table_id) REFERENCES devices(id) not valid;

alter table "public"."power_manegement_events" validate constraint "power_manegement_events_device_table_id_fkey";

-- alter table "public"."enterprise_settings_history" add constraint "enterprise_settings_history_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(id) ON DELETE CASCADE not valid;

-- alter table "public"."enterprise_settings_history" validate constraint "enterprise_settings_history_enterprise_id_fkey";

alter table "public"."projects" add constraint "projects_enterprise_id_fkey" FOREIGN KEY (enterprise_table_id) REFERENCES enterprises(id) not valid;

alter table "public"."projects" validate constraint "projects_enterprise_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_enterprise_access(enterprise_table_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM projects p
        JOIN project_members pm ON pm.project_id = p.id
        WHERE p.enterprise_table_id = has_enterprise_access.enterprise_table_id
        AND pm.user_id = (select auth.uid())
    );
END;$function$
;

CREATE OR REPLACE FUNCTION public.is_project_user(project_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_members.project_id = is_project_user.project_id
    AND project_members.user_id = (select auth.uid())
  );
END;$function$
;

grant delete on table "public"."application_reports" to "anon";

grant insert on table "public"."application_reports" to "anon";

grant references on table "public"."application_reports" to "anon";

grant select on table "public"."application_reports" to "anon";

grant trigger on table "public"."application_reports" to "anon";

grant truncate on table "public"."application_reports" to "anon";

grant update on table "public"."application_reports" to "anon";

grant delete on table "public"."application_reports" to "authenticated";

grant insert on table "public"."application_reports" to "authenticated";

grant references on table "public"."application_reports" to "authenticated";

grant select on table "public"."application_reports" to "authenticated";

grant trigger on table "public"."application_reports" to "authenticated";

grant truncate on table "public"."application_reports" to "authenticated";

grant update on table "public"."application_reports" to "authenticated";

grant delete on table "public"."application_reports" to "service_role";

grant insert on table "public"."application_reports" to "service_role";

grant references on table "public"."application_reports" to "service_role";

grant select on table "public"."application_reports" to "service_role";

grant trigger on table "public"."application_reports" to "service_role";

grant truncate on table "public"."application_reports" to "service_role";

grant update on table "public"."application_reports" to "service_role";

grant delete on table "public"."apps" to "anon";

grant insert on table "public"."apps" to "anon";

grant references on table "public"."apps" to "anon";

grant select on table "public"."apps" to "anon";

grant trigger on table "public"."apps" to "anon";

grant truncate on table "public"."apps" to "anon";

grant update on table "public"."apps" to "anon";

grant delete on table "public"."apps" to "authenticated";

grant insert on table "public"."apps" to "authenticated";

grant references on table "public"."apps" to "authenticated";

grant select on table "public"."apps" to "authenticated";

grant trigger on table "public"."apps" to "authenticated";

grant truncate on table "public"."apps" to "authenticated";

grant update on table "public"."apps" to "authenticated";

grant delete on table "public"."apps" to "service_role";

grant insert on table "public"."apps" to "service_role";

grant references on table "public"."apps" to "service_role";

grant select on table "public"."apps" to "service_role";

grant trigger on table "public"."apps" to "service_role";

grant truncate on table "public"."apps" to "service_role";

grant update on table "public"."apps" to "service_role";

grant delete on table "public"."devices" to "anon";

grant insert on table "public"."devices" to "anon";

grant references on table "public"."devices" to "anon";

grant select on table "public"."devices" to "anon";

grant trigger on table "public"."devices" to "anon";

grant truncate on table "public"."devices" to "anon";

grant update on table "public"."devices" to "anon";

grant delete on table "public"."devices" to "authenticated";

grant insert on table "public"."devices" to "authenticated";

grant references on table "public"."devices" to "authenticated";

grant select on table "public"."devices" to "authenticated";

grant trigger on table "public"."devices" to "authenticated";

grant truncate on table "public"."devices" to "authenticated";

grant update on table "public"."devices" to "authenticated";

grant delete on table "public"."devices" to "service_role";

grant insert on table "public"."devices" to "service_role";

grant references on table "public"."devices" to "service_role";

grant select on table "public"."devices" to "service_role";

grant trigger on table "public"."devices" to "service_role";

grant truncate on table "public"."devices" to "service_role";

grant update on table "public"."devices" to "service_role";

grant delete on table "public"."memory_events" to "anon";

grant insert on table "public"."memory_events" to "anon";

grant references on table "public"."memory_events" to "anon";

grant select on table "public"."memory_events" to "anon";

grant trigger on table "public"."memory_events" to "anon";

grant truncate on table "public"."memory_events" to "anon";

grant update on table "public"."memory_events" to "anon";

grant delete on table "public"."memory_events" to "authenticated";

grant insert on table "public"."memory_events" to "authenticated";

grant references on table "public"."memory_events" to "authenticated";

grant select on table "public"."memory_events" to "authenticated";

grant trigger on table "public"."memory_events" to "authenticated";

grant truncate on table "public"."memory_events" to "authenticated";

grant update on table "public"."memory_events" to "authenticated";

grant delete on table "public"."memory_events" to "service_role";

grant insert on table "public"."memory_events" to "service_role";

grant references on table "public"."memory_events" to "service_role";

grant select on table "public"."memory_events" to "service_role";

grant trigger on table "public"."memory_events" to "service_role";

grant truncate on table "public"."memory_events" to "service_role";

grant update on table "public"."memory_events" to "service_role";

grant delete on table "public"."policies" to "anon";

grant insert on table "public"."policies" to "anon";

grant references on table "public"."policies" to "anon";

grant select on table "public"."policies" to "anon";

grant trigger on table "public"."policies" to "anon";

grant truncate on table "public"."policies" to "anon";

grant update on table "public"."policies" to "anon";

grant delete on table "public"."policies" to "authenticated";

grant insert on table "public"."policies" to "authenticated";

grant references on table "public"."policies" to "authenticated";

grant select on table "public"."policies" to "authenticated";

grant trigger on table "public"."policies" to "authenticated";

grant truncate on table "public"."policies" to "authenticated";

grant update on table "public"."policies" to "authenticated";

grant delete on table "public"."policies" to "service_role";

grant insert on table "public"."policies" to "service_role";

grant references on table "public"."policies" to "service_role";

grant select on table "public"."policies" to "service_role";

grant trigger on table "public"."policies" to "service_role";

grant truncate on table "public"."policies" to "service_role";

grant update on table "public"."policies" to "service_role";

grant delete on table "public"."power_manegement_events" to "anon";

grant insert on table "public"."power_manegement_events" to "anon";

grant references on table "public"."power_manegement_events" to "anon";

grant select on table "public"."power_manegement_events" to "anon";

grant trigger on table "public"."power_manegement_events" to "anon";

grant truncate on table "public"."power_manegement_events" to "anon";

grant update on table "public"."power_manegement_events" to "anon";

grant delete on table "public"."power_manegement_events" to "authenticated";

grant insert on table "public"."power_manegement_events" to "authenticated";

grant references on table "public"."power_manegement_events" to "authenticated";

grant select on table "public"."power_manegement_events" to "authenticated";

grant trigger on table "public"."power_manegement_events" to "authenticated";

grant truncate on table "public"."power_manegement_events" to "authenticated";

grant update on table "public"."power_manegement_events" to "authenticated";

grant delete on table "public"."power_manegement_events" to "service_role";

grant insert on table "public"."power_manegement_events" to "service_role";

grant references on table "public"."power_manegement_events" to "service_role";

grant select on table "public"."power_manegement_events" to "service_role";

grant trigger on table "public"."power_manegement_events" to "service_role";

grant truncate on table "public"."power_manegement_events" to "service_role";

grant update on table "public"."power_manegement_events" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."apps"
as permissive
for delete
to public
using (has_enterprise_access(enterprise_table_id));


create policy "Enable insert for authenticated users only"
on "public"."apps"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."apps"
as permissive
for select
to public
using (true);


create policy "Policy with table joins"
on "public"."apps"
as permissive
for update
to public
using (has_enterprise_access(enterprise_table_id));


create policy "Enable delete for users based on user_id"
on "public"."devices"
as permissive
for delete
to public
using (has_enterprise_access(enterprise_table_id));


create policy "Enable insert for authenticated users only"
on "public"."devices"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."devices"
as permissive
for select
to public
using (true);


create policy "Policy with table joins"
on "public"."devices"
as permissive
for update
to public
using (has_enterprise_access(enterprise_table_id));


create policy "Enable delete for users based on user_id"
on "public"."enterprises"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Policy with table joins"
on "public"."enterprises"
as permissive
for update
to public
using (((owner_id = auth.uid()) OR has_enterprise_access(id)));


create policy "Enable delete for users based on user_id"
on "public"."policies"
as permissive
for delete
to public
using (has_enterprise_access(enterprise_table_id));


create policy "Enable insert for authenticated users only"
on "public"."policies"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."policies"
as permissive
for select
to authenticated
using (true);


create policy "Policy with table joins"
on "public"."policies"
as permissive
for update
to public
using (has_enterprise_access(enterprise_table_id));




