drop policy "Enable delete for users based on user_id" on "public"."policies";

drop policy "Enable insert for users based on user_id" on "public"."policies";

drop policy "Enable users to view their own data only" on "public"."policies";

drop policy "Policy with table joins" on "public"."policies";

alter table "public"."devices" drop constraint "devices_policy_id_fkey";

alter table "public"."policies" drop constraint "policies_pkey1";

drop index if exists "public"."policies_pkey1";

alter table "public"."devices" drop column "policy_id";

alter table "public"."devices" add column "policy_identifier" text;

alter table "public"."policies" add column "policy_identifier" text not null default generate_policy_identifier();

CREATE INDEX idx_devices_enterprise_id ON public.devices USING btree (enterprise_id);

CREATE INDEX idx_devices_policy_reference ON public.devices USING btree (enterprise_id, policy_identifier);

CREATE INDEX idx_policies_enterprise_id ON public.policies USING btree (enterprise_id);

CREATE INDEX idx_project_members_user_project ON public.project_members USING btree (user_id, project_id);

CREATE INDEX idx_projects_enterprise_id ON public.projects USING btree (enterprise_id);

CREATE INDEX idx_projects_owner_id ON public.projects USING btree (owner_id);

CREATE INDEX idx_pubsub_messages_enterprise_id ON public.pubsub_messages USING btree (enterprise_id);

CREATE UNIQUE INDEX policies_enterprise_policy_identifier_unique ON public.policies USING btree (enterprise_id, policy_identifier);

CREATE UNIQUE INDEX policies_pkey ON public.policies USING btree (policy_id);

alter table "public"."policies" add constraint "policies_pkey" PRIMARY KEY using index "policies_pkey";

alter table "public"."devices" add constraint "devices_policy_reference_fkey" FOREIGN KEY (enterprise_id, policy_identifier) REFERENCES policies(enterprise_id, policy_identifier) ON DELETE SET NULL not valid;

alter table "public"."devices" validate constraint "devices_policy_reference_fkey";

alter table "public"."policies" add constraint "policies_enterprise_policy_identifier_unique" UNIQUE using index "policies_enterprise_policy_identifier_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_policy_identifier()
 RETURNS text
 LANGUAGE plpgsql
AS $function$BEGIN
  -- 6文字のidentifierを生成して直接返す
  RETURN SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 6);
END;$function$
;

create policy "Authenticated users can create policies"
on "public"."policies"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can view policies"
on "public"."policies"
as permissive
for select
to authenticated
using (true);


create policy "Users can delete policies in their enterprises"
on "public"."policies"
as permissive
for delete
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Users can update policies in their enterprises"
on "public"."policies"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id));




