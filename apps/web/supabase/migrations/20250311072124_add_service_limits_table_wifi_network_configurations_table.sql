drop policy "SELECT" on "public"."application_reports";

create table "public"."service_limits" (
    "service_limit_id" uuid not null default gen_random_uuid(),
    "max_total_users" integer not null,
    "max_projects_per_user" integer not null,
    "max_kitting_per_user" integer not null,
    "max_policies_per_user" integer not null,
    "max_ssids_per_user" integer not null,
    "max_managed_apps_per_user" integer not null,
    "max_app_configs_per_app" integer not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."service_limits" enable row level security;

create table "public"."wifi_network_configurations" (
    "wifi_network_configuration_id" uuid not null default gen_random_uuid(),
    "enterprise_id" text not null,
    "config" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."wifi_network_configurations" enable row level security;

CREATE UNIQUE INDEX service_limits_pkey ON public.service_limits USING btree (service_limit_id);

CREATE UNIQUE INDEX wifi_network_configurations_pkey ON public.wifi_network_configurations USING btree (wifi_network_configuration_id);

alter table "public"."service_limits" add constraint "service_limits_pkey" PRIMARY KEY using index "service_limits_pkey";

alter table "public"."wifi_network_configurations" add constraint "wifi_network_configurations_pkey" PRIMARY KEY using index "wifi_network_configurations_pkey";

alter table "public"."wifi_network_configurations" add constraint "wifi_network_configurations_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."wifi_network_configurations" validate constraint "wifi_network_configurations_enterprise_id_fkey";

grant delete on table "public"."service_limits" to "anon";

grant insert on table "public"."service_limits" to "anon";

grant references on table "public"."service_limits" to "anon";

grant select on table "public"."service_limits" to "anon";

grant trigger on table "public"."service_limits" to "anon";

grant truncate on table "public"."service_limits" to "anon";

grant update on table "public"."service_limits" to "anon";

grant delete on table "public"."service_limits" to "authenticated";

grant insert on table "public"."service_limits" to "authenticated";

grant references on table "public"."service_limits" to "authenticated";

grant select on table "public"."service_limits" to "authenticated";

grant trigger on table "public"."service_limits" to "authenticated";

grant truncate on table "public"."service_limits" to "authenticated";

grant update on table "public"."service_limits" to "authenticated";

grant delete on table "public"."service_limits" to "service_role";

grant insert on table "public"."service_limits" to "service_role";

grant references on table "public"."service_limits" to "service_role";

grant select on table "public"."service_limits" to "service_role";

grant trigger on table "public"."service_limits" to "service_role";

grant truncate on table "public"."service_limits" to "service_role";

grant update on table "public"."service_limits" to "service_role";

grant delete on table "public"."wifi_network_configurations" to "anon";

grant insert on table "public"."wifi_network_configurations" to "anon";

grant references on table "public"."wifi_network_configurations" to "anon";

grant select on table "public"."wifi_network_configurations" to "anon";

grant trigger on table "public"."wifi_network_configurations" to "anon";

grant truncate on table "public"."wifi_network_configurations" to "anon";

grant update on table "public"."wifi_network_configurations" to "anon";

grant delete on table "public"."wifi_network_configurations" to "authenticated";

grant insert on table "public"."wifi_network_configurations" to "authenticated";

grant references on table "public"."wifi_network_configurations" to "authenticated";

grant select on table "public"."wifi_network_configurations" to "authenticated";

grant trigger on table "public"."wifi_network_configurations" to "authenticated";

grant truncate on table "public"."wifi_network_configurations" to "authenticated";

grant update on table "public"."wifi_network_configurations" to "authenticated";

grant delete on table "public"."wifi_network_configurations" to "service_role";

grant insert on table "public"."wifi_network_configurations" to "service_role";

grant references on table "public"."wifi_network_configurations" to "service_role";

grant select on table "public"."wifi_network_configurations" to "service_role";

grant trigger on table "public"."wifi_network_configurations" to "service_role";

grant truncate on table "public"."wifi_network_configurations" to "service_role";

grant update on table "public"."wifi_network_configurations" to "service_role";

create policy "Enable read access for all users"
on "public"."service_limits"
as permissive
for select
to authenticated
using (true);


create policy "Policy with security definer functions"
on "public"."wifi_network_configurations"
as permissive
for all
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


create policy "SELECT"
on "public"."application_reports"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));




