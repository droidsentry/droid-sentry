create table "public"."application_reports" (
    "device_identifier" text not null,
    "enterprise_id" text not null,
    "application_report_data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."application_reports" enable row level security;

create table "public"."apps" (
    "app_id" uuid not null default gen_random_uuid(),
    "package_name" text not null,
    "enterprise_id" text not null,
    "app_type" text not null,
    "app_data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."apps" enable row level security;

create table "public"."devices" (
    "device_id" uuid not null default gen_random_uuid(),
    "enterprise_id" text not null,
    "device_identifier" text not null,
    "device_display_name" text,
    "is_licensed" boolean not null,
    "device_data" jsonb not null,
    "operation_data" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null,
    "policy_identifier" text
);


alter table "public"."devices" enable row level security;

create table "public"."devices_histories" (
    "device_history_id" uuid not null default gen_random_uuid(),
    "enterprise_id" text not null,
    "device_identifier" text not null,
    "device_request_data" jsonb,
    "device_response_data" jsonb not null,
    "updated_by_user_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."devices_histories" enable row level security;

create table "public"."enterprises" (
    "enterprise_id" text not null,
    "owner_id" uuid not null default auth.uid(),
    "enterprise_data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."enterprises" enable row level security;

create table "public"."enterprises_histories" (
    "enterprises_history_id" uuid not null default gen_random_uuid(),
    "enterprise_id" text not null,
    "enterprise_request_data" jsonb not null,
    "created_by_user_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "enterprise_response_data" jsonb not null
);


alter table "public"."enterprises_histories" enable row level security;

create table "public"."memory_events" (
    "device_identifier" text not null,
    "enterprise_id" text not null,
    "memory_event_data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."memory_events" enable row level security;

create table "public"."operations" (
    "operation_id" uuid not null default gen_random_uuid(),
    "device_identifier" text not null,
    "enterprise_id" text not null,
    "operation_name" text,
    "operation_request_data" jsonb,
    "operation_response_data" jsonb not null,
    "created_by_user_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."operations" enable row level security;

create table "public"."policies" (
    "policy_id" uuid not null default gen_random_uuid(),
    "enterprise_id" text not null,
    "policy_display_name" text not null,
    "policy_data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null,
    "policy_identifier" text not null
);


alter table "public"."policies" enable row level security;

create table "public"."policies_histories" (
    "policy_history_id" uuid not null default gen_random_uuid(),
    "policy_id" uuid not null,
    "policy_request_data" jsonb not null,
    "policy_response_data" jsonb not null,
    "updated_by_user_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."policies_histories" enable row level security;

create table "public"."power_management_events" (
    "device_identifier" text not null,
    "enterprise_id" text not null,
    "power_management_event_data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."power_management_events" enable row level security;

create table "public"."project_members" (
    "project_member_id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "user_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null,
    "role" text not null
);


alter table "public"."project_members" enable row level security;

create table "public"."projects" (
    "project_id" uuid not null default gen_random_uuid(),
    "owner_id" uuid not null default auth.uid(),
    "project_name" text not null,
    "organization_name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "enterprise_id" text,
    "updated_at" timestamp with time zone not null
);


alter table "public"."projects" enable row level security;

create table "public"."pubsub_messages" (
    "pubsub_message_id" text not null,
    "enterprise_id" text,
    "device_identifier" text,
    "notification_type" text not null,
    "pubsub_message_data" jsonb not null,
    "pubsub_message_attributes_data" jsonb not null,
    "publish_time" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."pubsub_messages" enable row level security;

create table "public"."subscription_plans" (
    "plan_id" uuid not null default gen_random_uuid(),
    "subscription_id" uuid,
    "name" text not null,
    "interval" text not null,
    "email_support" boolean not null default false,
    "phone_support" boolean not null default false,
    "device_limit" integer not null default 1,
    "policy_limit" integer not null default 1,
    "project_limit" integer not null default 1,
    "project_sharing" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."subscription_plans" enable row level security;

create table "public"."subscription_usages" (
    "usage_id" uuid not null default gen_random_uuid(),
    "subscription_id" uuid,
    "monthly_messages" integer not null default 0,
    "monthly_data_transfer" integer not null default 0,
    "total_devices" integer not null default 0,
    "active_devices" integer not null default 0,
    "inactive_devices" integer not null default 0,
    "total_policies" integer not null default 0,
    "custom_policies" integer not null default 0,
    "total_projects" integer not null default 0,
    "shared_projects" integer not null default 0,
    "last_reset" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."subscription_usages" enable row level security;

create table "public"."subscriptions" (
    "subscription_id" uuid not null default gen_random_uuid(),
    "owner_id" uuid not null default auth.uid(),
    "stripe_subscription_id" text not null,
    "status" text not null,
    "plan_config" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."subscriptions" enable row level security;

create table "public"."usage_log_events" (
    "usage_log_event_id" uuid not null default gen_random_uuid(),
    "pubsub_message_id" text not null,
    "usage_log_event_time" timestamp with time zone not null,
    "usage_log_event_type" text not null,
    "usage_log_event_data" jsonb not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."usage_log_events" enable row level security;

create table "public"."users" (
    "user_id" uuid not null default auth.uid(),
    "email" text not null,
    "username" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX application_reports_pkey ON public.application_reports USING btree (device_identifier, enterprise_id);

CREATE UNIQUE INDEX apps_package_name_enterprise_unique ON public.apps USING btree (enterprise_id, package_name);

CREATE UNIQUE INDEX apps_pkey ON public.apps USING btree (app_id);

CREATE UNIQUE INDEX devices_enterprise_device_unique ON public.devices USING btree (enterprise_id, device_identifier);

CREATE UNIQUE INDEX devices_histories_pkey ON public.devices_histories USING btree (device_history_id);

CREATE UNIQUE INDEX devices_pkey1 ON public.devices USING btree (device_id);

CREATE UNIQUE INDEX enterprises_histories_pkey ON public.enterprises_histories USING btree (enterprises_history_id);

CREATE UNIQUE INDEX enterprises_pkey1 ON public.enterprises USING btree (enterprise_id);

CREATE INDEX idx_devices_enterprise_id ON public.devices USING btree (enterprise_id);

CREATE INDEX idx_devices_policy_reference ON public.devices USING btree (enterprise_id, policy_identifier);

CREATE INDEX idx_policies_enterprise_id ON public.policies USING btree (enterprise_id);

CREATE INDEX idx_project_members_user_project ON public.project_members USING btree (user_id, project_id);

CREATE INDEX idx_projects_enterprise_id ON public.projects USING btree (enterprise_id);

CREATE INDEX idx_projects_owner_id ON public.projects USING btree (owner_id);

CREATE INDEX idx_pubsub_messages_enterprise_device ON public.pubsub_messages USING btree (enterprise_id, device_identifier);

CREATE INDEX idx_pubsub_messages_enterprise_id ON public.pubsub_messages USING btree (enterprise_id);

CREATE INDEX idx_subscription_plans_subscription_id ON public.subscription_plans USING btree (subscription_id);

CREATE INDEX idx_subscription_usages_subscription_id ON public.subscription_usages USING btree (subscription_id);

CREATE UNIQUE INDEX memory_events_pkey ON public.memory_events USING btree (device_identifier, enterprise_id);

CREATE UNIQUE INDEX operations_pkey ON public.operations USING btree (operation_id);

CREATE UNIQUE INDEX policies_enterprise_policy_identifier_unique ON public.policies USING btree (enterprise_id, policy_identifier);

CREATE UNIQUE INDEX policies_histories_pkey ON public.policies_histories USING btree (policy_history_id);

CREATE UNIQUE INDEX policies_pkey ON public.policies USING btree (policy_id);

CREATE UNIQUE INDEX power_management_events_pkey ON public.power_management_events USING btree (device_identifier, enterprise_id);

CREATE UNIQUE INDEX project_members_pkey ON public.project_members USING btree (project_member_id);

CREATE UNIQUE INDEX projects_id_key ON public.projects USING btree (project_id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (project_id);

CREATE UNIQUE INDEX pubsub_messages_pkey ON public.pubsub_messages USING btree (pubsub_message_id);

CREATE UNIQUE INDEX subscription_plans_pkey ON public.subscription_plans USING btree (plan_id);

CREATE UNIQUE INDEX subscription_usages_pkey ON public.subscription_usages USING btree (usage_id);

CREATE UNIQUE INDEX subscriptions_owner_id_key ON public.subscriptions USING btree (owner_id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (subscription_id);

CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key ON public.subscriptions USING btree (stripe_subscription_id);

CREATE UNIQUE INDEX unique_subscription_plan ON public.subscription_plans USING btree (subscription_id);

CREATE UNIQUE INDEX unique_subscription_usage ON public.subscription_usages USING btree (subscription_id);

CREATE UNIQUE INDEX usage_log_events_pkey ON public.usage_log_events USING btree (usage_log_event_id);

CREATE UNIQUE INDEX usernames_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX usernames_username_key ON public.users USING btree (username);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (user_id);

alter table "public"."application_reports" add constraint "application_reports_pkey" PRIMARY KEY using index "application_reports_pkey";

alter table "public"."apps" add constraint "apps_pkey" PRIMARY KEY using index "apps_pkey";

alter table "public"."devices" add constraint "devices_pkey1" PRIMARY KEY using index "devices_pkey1";

alter table "public"."devices_histories" add constraint "devices_histories_pkey" PRIMARY KEY using index "devices_histories_pkey";

alter table "public"."enterprises" add constraint "enterprises_pkey1" PRIMARY KEY using index "enterprises_pkey1";

alter table "public"."enterprises_histories" add constraint "enterprises_histories_pkey" PRIMARY KEY using index "enterprises_histories_pkey";

alter table "public"."memory_events" add constraint "memory_events_pkey" PRIMARY KEY using index "memory_events_pkey";

alter table "public"."operations" add constraint "operations_pkey" PRIMARY KEY using index "operations_pkey";

alter table "public"."policies" add constraint "policies_pkey" PRIMARY KEY using index "policies_pkey";

alter table "public"."policies_histories" add constraint "policies_histories_pkey" PRIMARY KEY using index "policies_histories_pkey";

alter table "public"."power_management_events" add constraint "power_management_events_pkey" PRIMARY KEY using index "power_management_events_pkey";

alter table "public"."project_members" add constraint "project_members_pkey" PRIMARY KEY using index "project_members_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."pubsub_messages" add constraint "pubsub_messages_pkey" PRIMARY KEY using index "pubsub_messages_pkey";

alter table "public"."subscription_plans" add constraint "subscription_plans_pkey" PRIMARY KEY using index "subscription_plans_pkey";

alter table "public"."subscription_usages" add constraint "subscription_usages_pkey" PRIMARY KEY using index "subscription_usages_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."usage_log_events" add constraint "usage_log_events_pkey" PRIMARY KEY using index "usage_log_events_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."application_reports" add constraint "application_reports_device_identifier_enterprise_id_fkey" FOREIGN KEY (device_identifier, enterprise_id) REFERENCES devices(device_identifier, enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."application_reports" validate constraint "application_reports_device_identifier_enterprise_id_fkey";

alter table "public"."apps" add constraint "apps_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."apps" validate constraint "apps_enterprise_id_fkey";

alter table "public"."apps" add constraint "apps_package_name_enterprise_unique" UNIQUE using index "apps_package_name_enterprise_unique";

alter table "public"."devices" add constraint "devices_enterprise_device_unique" UNIQUE using index "devices_enterprise_device_unique";

alter table "public"."devices" add constraint "devices_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."devices" validate constraint "devices_enterprise_id_fkey";

alter table "public"."devices" add constraint "devices_policy_reference_fkey" FOREIGN KEY (enterprise_id, policy_identifier) REFERENCES policies(enterprise_id, policy_identifier) ON DELETE SET NULL not valid;

alter table "public"."devices" validate constraint "devices_policy_reference_fkey";

alter table "public"."devices_histories" add constraint "devices_histories_device_identifier_enterprise_id_fkey" FOREIGN KEY (device_identifier, enterprise_id) REFERENCES devices(device_identifier, enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."devices_histories" validate constraint "devices_histories_device_identifier_enterprise_id_fkey";

alter table "public"."devices_histories" add constraint "devices_histories_updated_by_user_id_fkey" FOREIGN KEY (updated_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."devices_histories" validate constraint "devices_histories_updated_by_user_id_fkey";

alter table "public"."enterprises" add constraint "enterprises_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES subscriptions(owner_id) ON DELETE RESTRICT not valid;

alter table "public"."enterprises" validate constraint "enterprises_owner_id_fkey";

alter table "public"."enterprises_histories" add constraint "enterprises_histories_created_by_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."enterprises_histories" validate constraint "enterprises_histories_created_by_user_id_fkey";

alter table "public"."enterprises_histories" add constraint "enterprises_histories_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."enterprises_histories" validate constraint "enterprises_histories_enterprise_id_fkey";

alter table "public"."memory_events" add constraint "memory_events_device_identifier_enterprise_id_fkey" FOREIGN KEY (device_identifier, enterprise_id) REFERENCES devices(device_identifier, enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."memory_events" validate constraint "memory_events_device_identifier_enterprise_id_fkey";

alter table "public"."operations" add constraint "operations_created_by_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."operations" validate constraint "operations_created_by_user_id_fkey";

alter table "public"."operations" add constraint "operations_device_identifier_enterprise_id_fkey" FOREIGN KEY (device_identifier, enterprise_id) REFERENCES devices(device_identifier, enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."operations" validate constraint "operations_device_identifier_enterprise_id_fkey";

alter table "public"."policies" add constraint "policies_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."policies" validate constraint "policies_enterprise_id_fkey";

alter table "public"."policies" add constraint "policies_enterprise_policy_identifier_unique" UNIQUE using index "policies_enterprise_policy_identifier_unique";

alter table "public"."policies_histories" add constraint "policies_histories_policy_id_fkey" FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE not valid;

alter table "public"."policies_histories" validate constraint "policies_histories_policy_id_fkey";

alter table "public"."policies_histories" add constraint "policies_histories_updated_by_user_id_fkey" FOREIGN KEY (updated_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."policies_histories" validate constraint "policies_histories_updated_by_user_id_fkey";

alter table "public"."power_management_events" add constraint "power_management_events_device_identifier_enterprise_id_fkey" FOREIGN KEY (device_identifier, enterprise_id) REFERENCES devices(device_identifier, enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."power_management_events" validate constraint "power_management_events_device_identifier_enterprise_id_fkey";

alter table "public"."project_members" add constraint "project_members_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE not valid;

alter table "public"."project_members" validate constraint "project_members_project_id_fkey";

alter table "public"."project_members" add constraint "project_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."project_members" validate constraint "project_members_user_id_fkey";

alter table "public"."projects" add constraint "projects_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_enterprise_id_fkey";

alter table "public"."projects" add constraint "projects_id_key" UNIQUE using index "projects_id_key";

alter table "public"."projects" add constraint "projects_owner_id_fkey1" FOREIGN KEY (owner_id) REFERENCES subscriptions(owner_id) ON DELETE RESTRICT not valid;

alter table "public"."projects" validate constraint "projects_owner_id_fkey1";

alter table "public"."pubsub_messages" add constraint "pubsub_messages_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."pubsub_messages" validate constraint "pubsub_messages_enterprise_id_fkey";

alter table "public"."subscription_plans" add constraint "subscription_plans_interval_check" CHECK (("interval" = ANY (ARRAY['month'::text, 'year'::text]))) not valid;

alter table "public"."subscription_plans" validate constraint "subscription_plans_interval_check";

alter table "public"."subscription_plans" add constraint "subscription_plans_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id) ON DELETE CASCADE not valid;

alter table "public"."subscription_plans" validate constraint "subscription_plans_subscription_id_fkey";

alter table "public"."subscription_plans" add constraint "unique_subscription_plan" UNIQUE using index "unique_subscription_plan";

alter table "public"."subscription_usages" add constraint "subscription_usages_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id) ON DELETE CASCADE not valid;

alter table "public"."subscription_usages" validate constraint "subscription_usages_subscription_id_fkey";

alter table "public"."subscription_usages" add constraint "unique_subscription_usage" UNIQUE using index "unique_subscription_usage";

alter table "public"."subscriptions" add constraint "subscriptions_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE RESTRICT not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_owner_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_owner_id_key" UNIQUE using index "subscriptions_owner_id_key";

alter table "public"."subscriptions" add constraint "subscriptions_stripe_subscription_id_key" UNIQUE using index "subscriptions_stripe_subscription_id_key";

alter table "public"."usage_log_events" add constraint "usage_log_events_pubsub_message_id_fkey" FOREIGN KEY (pubsub_message_id) REFERENCES pubsub_messages(pubsub_message_id) ON DELETE CASCADE not valid;

alter table "public"."usage_log_events" validate constraint "usage_log_events_pubsub_message_id_fkey";

alter table "public"."users" add constraint "usernames_email_key" UNIQUE using index "usernames_email_key";

alter table "public"."users" add constraint "usernames_username_key" UNIQUE using index "usernames_username_key";

alter table "public"."users" add constraint "users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.can_access_device(device_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$begin
  return exists (
    select 1 
    from public.devices d
    where d.device_id = can_access_device.device_id
    and can_access_enterprise(d.enterprise_id)
  );
end;$function$
;

CREATE OR REPLACE FUNCTION public.can_access_enterprise(enterprise_id text)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return exists (
    select 1 
    from public.projects p
    join public.project_members pm on pm.project_id = p.project_id  -- カラム名の修正
    where p.enterprise_id = can_access_enterprise.enterprise_id
    and (
      p.owner_id = (select auth.uid())  -- 課金ユーザー（オーナー）のチェックを追加
      or
      pm.user_id = (select auth.uid())  -- プロジェクトメンバーのチェック
    )
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.can_access_policy(policy_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
begin
  return exists (
    select 1 
    from public.policies p
    where p.policy_id = can_access_policy.policy_id
    and can_access_enterprise(p.enterprise_id)
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.can_access_project(project_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return exists (
    select 1
    from public.project_members
    where project_members.project_id = can_access_project.project_id
    and project_members.user_id = (select auth.uid())
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.can_access_usage_log_events(pubsub_message_id text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$begin
  return exists (
    select 1 
    from pubsub_messages p
    where p.pubsub_message_id = can_access_usage_log_events.pubsub_message_id
    and can_access_enterprise(p.enterprise_id)
  );
end;$function$
;

CREATE OR REPLACE FUNCTION public.generate_device_display_name(target_enterprise_id text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$DECLARE
    next_number INTEGER;
    new_device_display_name TEXT;
BEGIN
    -- 「端末」で始まり、5桁の数字が続く形式から番号を抽出
    SELECT COALESCE(MAX(
        CASE 
            -- 「端末」で始まり、5桁の数字が続き、その後は任意の文字列
            WHEN device_display_name ~ '^端末[0-9]{5}' THEN
                NULLIF(
                    REGEXP_REPLACE(device_display_name, '^端末([0-9]{5}).*$', '\1'),
                    ''
                )::INTEGER
            ELSE NULL
        END
    ), 0) + 1
    INTO next_number
    FROM devices
    WHERE enterprise_id = target_enterprise_id
    AND device_display_name ~ '^端末\d{5}';

     -- 5桁でゼロパディング（端末00001, 端末00002, ...）
    new_device_display_name := '端末' || LPAD(next_number::TEXT, 5, '0');
    
    RETURN new_device_display_name;
END;$function$
;

CREATE OR REPLACE FUNCTION public.generate_device_id_with_fallback(target_enterprise_id text, prefix text, base_digits integer, sub_digits integer, separator text, overflow_prefix text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$DECLARE
    next_number INTEGER;
    sub_number INTEGER;
    new_device_display_name TEXT;
    max_number INTEGER;
    max_sub_number INTEGER;
    base_pattern TEXT;
    sub_pattern TEXT;
    overflow_pattern TEXT;
    overflow_number INTEGER;
BEGIN
    -- 最大値の計算
    max_number := POWER(10, base_digits) - 1;
    max_sub_number := POWER(10, sub_digits) - 1;
    
    -- 正規表現パターンの構築
    base_pattern := '^' || prefix || '[0-9]{' || base_digits || '}$';
    sub_pattern := '^' || prefix || max_number || separator || '[0-9]{' || sub_digits || '}$';
    overflow_pattern := '^' || overflow_prefix || '[0-9]+$';

    -- まず、通常パターンの最大番号を確認
    SELECT COALESCE(MAX(
        CASE 
            WHEN device_display_name ~ base_pattern THEN
                REGEXP_REPLACE(
                    device_display_name, 
                    '^' || prefix || '([0-9]{' || base_digits || '})$',
                    '\1'
                )::INTEGER
        END
    ), 0)
    INTO next_number
    FROM devices
    WHERE enterprise_id = target_enterprise_id;

    -- 基本番号が最大値に達していない場合
    IF next_number < max_number THEN
        -- 通常の連番を生成
        next_number := next_number + 1;
        RETURN prefix || LPAD(next_number::TEXT, base_digits, '0');
    END IF;

    -- サブ番号付きの最大値を取得
    SELECT COALESCE(MAX(
        CASE 
            WHEN device_display_name ~ sub_pattern THEN
                REGEXP_REPLACE(
                    device_display_name,
                    '^' || prefix || max_number || separator || '([0-9]{' || sub_digits || '})$',
                    '\1'
                )::INTEGER
        END
    ), 0) + 1
    INTO sub_number
    FROM devices
    WHERE enterprise_id = target_enterprise_id;

    -- サブ番号が上限内の場合
    IF sub_number <= max_sub_number THEN
        RETURN prefix || 
               max_number::TEXT || 
               separator || 
               LPAD(sub_number::TEXT, sub_digits, '0');
    END IF;

    -- オーバーフロー時の処理
    SELECT COALESCE(MAX(
        CASE 
            WHEN device_display_name ~ overflow_pattern THEN
                REGEXP_REPLACE(
                    device_display_name,
                    '^' || overflow_prefix || '([0-9]+)$',
                    '\1'
                )::INTEGER
        END
    ), 0) + 1
    INTO overflow_number
    FROM devices
    WHERE enterprise_id = target_enterprise_id;

    RETURN overflow_prefix || overflow_number::TEXT;
END;$function$
;

CREATE OR REPLACE FUNCTION public.generate_policy_identifier()
 RETURNS text
 LANGUAGE plpgsql
AS $function$BEGIN
  -- 6文字のidentifierを生成して直接返す
  RETURN SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 6);
END;$function$
;

CREATE OR REPLACE FUNCTION public.is_active_subscriber()
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return exists (
    select 1 
    from public.subscriptions 
    where owner_id = (select auth.uid())
    and status = 'active'
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_device_display_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    -- device_display_nameが設定されていない場合のみ自動生成
    IF NEW.device_display_name IS NULL THEN
        NEW.device_display_name := generate_device_display_name(NEW.enterprise_id);
    END IF;
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.set_device_display_name_with_fallback()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    -- デフォルト値の定義
    CONST_PREFIX CONSTANT TEXT := '端末';
    CONST_BASE_DIGITS CONSTANT INTEGER := 5;
    CONST_SUB_DIGITS CONSTANT INTEGER := 5;
    CONST_SEPARATOR CONSTANT TEXT := '-';
    CONST_OVERFLOW_PREFIX CONSTANT TEXT := '端末99999-99999-';
BEGIN
    -- enterprise_idのNULLチェック
    IF NEW.enterprise_id IS NULL THEN
        RAISE EXCEPTION 'enterprise_id cannot be null';
    END IF;

    -- device_display_nameが未設定の場合のみ自動生成
    IF NEW.device_display_name IS NULL THEN
        NEW.device_display_name := generate_device_id_with_fallback(
            NEW.enterprise_id,
            CONST_PREFIX,
            CONST_BASE_DIGITS,
            CONST_SUB_DIGITS,
            CONST_SEPARATOR,
            CONST_OVERFLOW_PREFIX
        );
    END IF;

    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.upsert_device_data(devices jsonb[], application_reports jsonb[], memory_events jsonb[], power_management_events jsonb[], device_histories jsonb[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  -- トランザクション分離レベル（デフォルト値のまま）とタイムアウトの設定
  set local transaction isolation level read committed;
  set local lock_timeout = '5s';

  -- トランザクション開始
  begin
    -- デバイスデータの更新（最初に実行）
    insert into public.devices (
      device_identifier,
      enterprise_id,
      policy_id,
      is_licensed,
      device_data,
      updated_at
    )
    select
      (d->>'device_identifier')::text,
      (d->>'enterprise_id')::text,
      (d->>'policy_id')::uuid,
      (d->>'is_licensed')::boolean,
      (d->>'device_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(devices) as d
    on conflict (device_identifier, enterprise_id)
    do update set
      policy_id = excluded.policy_id,
      is_licensed = excluded.is_licensed,
      device_data = excluded.device_data,
      updated_at = excluded.updated_at;

    -- アプリケーションレポートの更新（2番目）
    insert into public.application_reports (
      device_identifier,
      enterprise_id,
      application_report_data,
      updated_at
    )
    select
      (d->>'device_identifier')::text,
      (d->>'enterprise_id')::text,
      (d->>'application_report_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(application_reports) as d
    on conflict (device_identifier, enterprise_id)
    do update set
      application_report_data = excluded.application_report_data,
      updated_at = excluded.updated_at;

    -- メモリイベントの更新（3番目）
    insert into public.memory_events (
      device_identifier,
      enterprise_id,
      memory_event_data,
      updated_at
    )
    select
      (d->>'device_identifier')::text,
      (d->>'enterprise_id')::text,
      (d->>'memory_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(memory_events) as d
    on conflict (device_identifier, enterprise_id)
    do update set
      memory_event_data = excluded.memory_event_data,
      updated_at = excluded.updated_at;

    -- 電源管理イベントの更新（4番目）
    insert into public.power_management_events (
      device_identifier,
      enterprise_id,
      power_management_event_data,
      updated_at
    )
    select
      (d->>'device_identifier')::text,
      (d->>'enterprise_id')::text,
      (d->>'power_management_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(power_management_events) as d
    on conflict (device_identifier, enterprise_id)
    do update set
      power_management_event_data = excluded.power_management_event_data,
      updated_at = excluded.updated_at;

    -- デバイス履歴の挿入（最後に実行）
    insert into devices_histories (
      device_identifier,
      enterprise_id,
      device_response_data
    )
    select
      (d->>'device_identifier')::text,
      (d->>'enterprise_id')::text,
      (d->>'device_response_data')::jsonb
    from unnest(device_histories) as d;

  exception
    when lock_not_available then
      -- ロックタイムアウトの場合の特別なエラーハンドリング
      raise exception 'Lock timeout occurred: Could not acquire necessary locks within 5 seconds';
    when deadlock_detected then
      -- デッドロックが検出された場合の特別なエラーハンドリング
      raise exception 'Deadlock detected: Transaction was chosen as deadlock victim';
    when others then
      -- その他のエラーが発生した場合はロールバック
      raise exception 'Transaction failed: %', SQLERRM;
  end;
end;
$function$
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

grant delete on table "public"."devices_histories" to "anon";

grant insert on table "public"."devices_histories" to "anon";

grant references on table "public"."devices_histories" to "anon";

grant select on table "public"."devices_histories" to "anon";

grant trigger on table "public"."devices_histories" to "anon";

grant truncate on table "public"."devices_histories" to "anon";

grant update on table "public"."devices_histories" to "anon";

grant delete on table "public"."devices_histories" to "authenticated";

grant insert on table "public"."devices_histories" to "authenticated";

grant references on table "public"."devices_histories" to "authenticated";

grant select on table "public"."devices_histories" to "authenticated";

grant trigger on table "public"."devices_histories" to "authenticated";

grant truncate on table "public"."devices_histories" to "authenticated";

grant update on table "public"."devices_histories" to "authenticated";

grant delete on table "public"."devices_histories" to "service_role";

grant insert on table "public"."devices_histories" to "service_role";

grant references on table "public"."devices_histories" to "service_role";

grant select on table "public"."devices_histories" to "service_role";

grant trigger on table "public"."devices_histories" to "service_role";

grant truncate on table "public"."devices_histories" to "service_role";

grant update on table "public"."devices_histories" to "service_role";

grant delete on table "public"."enterprises" to "anon";

grant insert on table "public"."enterprises" to "anon";

grant references on table "public"."enterprises" to "anon";

grant select on table "public"."enterprises" to "anon";

grant trigger on table "public"."enterprises" to "anon";

grant truncate on table "public"."enterprises" to "anon";

grant update on table "public"."enterprises" to "anon";

grant delete on table "public"."enterprises" to "authenticated";

grant insert on table "public"."enterprises" to "authenticated";

grant references on table "public"."enterprises" to "authenticated";

grant select on table "public"."enterprises" to "authenticated";

grant trigger on table "public"."enterprises" to "authenticated";

grant truncate on table "public"."enterprises" to "authenticated";

grant update on table "public"."enterprises" to "authenticated";

grant delete on table "public"."enterprises" to "service_role";

grant insert on table "public"."enterprises" to "service_role";

grant references on table "public"."enterprises" to "service_role";

grant select on table "public"."enterprises" to "service_role";

grant trigger on table "public"."enterprises" to "service_role";

grant truncate on table "public"."enterprises" to "service_role";

grant update on table "public"."enterprises" to "service_role";

grant delete on table "public"."enterprises_histories" to "anon";

grant insert on table "public"."enterprises_histories" to "anon";

grant references on table "public"."enterprises_histories" to "anon";

grant select on table "public"."enterprises_histories" to "anon";

grant trigger on table "public"."enterprises_histories" to "anon";

grant truncate on table "public"."enterprises_histories" to "anon";

grant update on table "public"."enterprises_histories" to "anon";

grant delete on table "public"."enterprises_histories" to "authenticated";

grant insert on table "public"."enterprises_histories" to "authenticated";

grant references on table "public"."enterprises_histories" to "authenticated";

grant select on table "public"."enterprises_histories" to "authenticated";

grant trigger on table "public"."enterprises_histories" to "authenticated";

grant truncate on table "public"."enterprises_histories" to "authenticated";

grant update on table "public"."enterprises_histories" to "authenticated";

grant delete on table "public"."enterprises_histories" to "service_role";

grant insert on table "public"."enterprises_histories" to "service_role";

grant references on table "public"."enterprises_histories" to "service_role";

grant select on table "public"."enterprises_histories" to "service_role";

grant trigger on table "public"."enterprises_histories" to "service_role";

grant truncate on table "public"."enterprises_histories" to "service_role";

grant update on table "public"."enterprises_histories" to "service_role";

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

grant delete on table "public"."operations" to "anon";

grant insert on table "public"."operations" to "anon";

grant references on table "public"."operations" to "anon";

grant select on table "public"."operations" to "anon";

grant trigger on table "public"."operations" to "anon";

grant truncate on table "public"."operations" to "anon";

grant update on table "public"."operations" to "anon";

grant delete on table "public"."operations" to "authenticated";

grant insert on table "public"."operations" to "authenticated";

grant references on table "public"."operations" to "authenticated";

grant select on table "public"."operations" to "authenticated";

grant trigger on table "public"."operations" to "authenticated";

grant truncate on table "public"."operations" to "authenticated";

grant update on table "public"."operations" to "authenticated";

grant delete on table "public"."operations" to "service_role";

grant insert on table "public"."operations" to "service_role";

grant references on table "public"."operations" to "service_role";

grant select on table "public"."operations" to "service_role";

grant trigger on table "public"."operations" to "service_role";

grant truncate on table "public"."operations" to "service_role";

grant update on table "public"."operations" to "service_role";

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

grant delete on table "public"."policies_histories" to "anon";

grant insert on table "public"."policies_histories" to "anon";

grant references on table "public"."policies_histories" to "anon";

grant select on table "public"."policies_histories" to "anon";

grant trigger on table "public"."policies_histories" to "anon";

grant truncate on table "public"."policies_histories" to "anon";

grant update on table "public"."policies_histories" to "anon";

grant delete on table "public"."policies_histories" to "authenticated";

grant insert on table "public"."policies_histories" to "authenticated";

grant references on table "public"."policies_histories" to "authenticated";

grant select on table "public"."policies_histories" to "authenticated";

grant trigger on table "public"."policies_histories" to "authenticated";

grant truncate on table "public"."policies_histories" to "authenticated";

grant update on table "public"."policies_histories" to "authenticated";

grant delete on table "public"."policies_histories" to "service_role";

grant insert on table "public"."policies_histories" to "service_role";

grant references on table "public"."policies_histories" to "service_role";

grant select on table "public"."policies_histories" to "service_role";

grant trigger on table "public"."policies_histories" to "service_role";

grant truncate on table "public"."policies_histories" to "service_role";

grant update on table "public"."policies_histories" to "service_role";

grant delete on table "public"."power_management_events" to "anon";

grant insert on table "public"."power_management_events" to "anon";

grant references on table "public"."power_management_events" to "anon";

grant select on table "public"."power_management_events" to "anon";

grant trigger on table "public"."power_management_events" to "anon";

grant truncate on table "public"."power_management_events" to "anon";

grant update on table "public"."power_management_events" to "anon";

grant delete on table "public"."power_management_events" to "authenticated";

grant insert on table "public"."power_management_events" to "authenticated";

grant references on table "public"."power_management_events" to "authenticated";

grant select on table "public"."power_management_events" to "authenticated";

grant trigger on table "public"."power_management_events" to "authenticated";

grant truncate on table "public"."power_management_events" to "authenticated";

grant update on table "public"."power_management_events" to "authenticated";

grant delete on table "public"."power_management_events" to "service_role";

grant insert on table "public"."power_management_events" to "service_role";

grant references on table "public"."power_management_events" to "service_role";

grant select on table "public"."power_management_events" to "service_role";

grant trigger on table "public"."power_management_events" to "service_role";

grant truncate on table "public"."power_management_events" to "service_role";

grant update on table "public"."power_management_events" to "service_role";

grant delete on table "public"."project_members" to "anon";

grant insert on table "public"."project_members" to "anon";

grant references on table "public"."project_members" to "anon";

grant select on table "public"."project_members" to "anon";

grant trigger on table "public"."project_members" to "anon";

grant truncate on table "public"."project_members" to "anon";

grant update on table "public"."project_members" to "anon";

grant delete on table "public"."project_members" to "authenticated";

grant insert on table "public"."project_members" to "authenticated";

grant references on table "public"."project_members" to "authenticated";

grant select on table "public"."project_members" to "authenticated";

grant trigger on table "public"."project_members" to "authenticated";

grant truncate on table "public"."project_members" to "authenticated";

grant update on table "public"."project_members" to "authenticated";

grant delete on table "public"."project_members" to "service_role";

grant insert on table "public"."project_members" to "service_role";

grant references on table "public"."project_members" to "service_role";

grant select on table "public"."project_members" to "service_role";

grant trigger on table "public"."project_members" to "service_role";

grant truncate on table "public"."project_members" to "service_role";

grant update on table "public"."project_members" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."pubsub_messages" to "anon";

grant insert on table "public"."pubsub_messages" to "anon";

grant references on table "public"."pubsub_messages" to "anon";

grant select on table "public"."pubsub_messages" to "anon";

grant trigger on table "public"."pubsub_messages" to "anon";

grant truncate on table "public"."pubsub_messages" to "anon";

grant update on table "public"."pubsub_messages" to "anon";

grant delete on table "public"."pubsub_messages" to "authenticated";

grant insert on table "public"."pubsub_messages" to "authenticated";

grant references on table "public"."pubsub_messages" to "authenticated";

grant select on table "public"."pubsub_messages" to "authenticated";

grant trigger on table "public"."pubsub_messages" to "authenticated";

grant truncate on table "public"."pubsub_messages" to "authenticated";

grant update on table "public"."pubsub_messages" to "authenticated";

grant delete on table "public"."pubsub_messages" to "service_role";

grant insert on table "public"."pubsub_messages" to "service_role";

grant references on table "public"."pubsub_messages" to "service_role";

grant select on table "public"."pubsub_messages" to "service_role";

grant trigger on table "public"."pubsub_messages" to "service_role";

grant truncate on table "public"."pubsub_messages" to "service_role";

grant update on table "public"."pubsub_messages" to "service_role";

grant delete on table "public"."subscription_plans" to "anon";

grant insert on table "public"."subscription_plans" to "anon";

grant references on table "public"."subscription_plans" to "anon";

grant select on table "public"."subscription_plans" to "anon";

grant trigger on table "public"."subscription_plans" to "anon";

grant truncate on table "public"."subscription_plans" to "anon";

grant update on table "public"."subscription_plans" to "anon";

grant delete on table "public"."subscription_plans" to "authenticated";

grant insert on table "public"."subscription_plans" to "authenticated";

grant references on table "public"."subscription_plans" to "authenticated";

grant select on table "public"."subscription_plans" to "authenticated";

grant trigger on table "public"."subscription_plans" to "authenticated";

grant truncate on table "public"."subscription_plans" to "authenticated";

grant update on table "public"."subscription_plans" to "authenticated";

grant delete on table "public"."subscription_plans" to "service_role";

grant insert on table "public"."subscription_plans" to "service_role";

grant references on table "public"."subscription_plans" to "service_role";

grant select on table "public"."subscription_plans" to "service_role";

grant trigger on table "public"."subscription_plans" to "service_role";

grant truncate on table "public"."subscription_plans" to "service_role";

grant update on table "public"."subscription_plans" to "service_role";

grant delete on table "public"."subscription_usages" to "anon";

grant insert on table "public"."subscription_usages" to "anon";

grant references on table "public"."subscription_usages" to "anon";

grant select on table "public"."subscription_usages" to "anon";

grant trigger on table "public"."subscription_usages" to "anon";

grant truncate on table "public"."subscription_usages" to "anon";

grant update on table "public"."subscription_usages" to "anon";

grant delete on table "public"."subscription_usages" to "authenticated";

grant insert on table "public"."subscription_usages" to "authenticated";

grant references on table "public"."subscription_usages" to "authenticated";

grant select on table "public"."subscription_usages" to "authenticated";

grant trigger on table "public"."subscription_usages" to "authenticated";

grant truncate on table "public"."subscription_usages" to "authenticated";

grant update on table "public"."subscription_usages" to "authenticated";

grant delete on table "public"."subscription_usages" to "service_role";

grant insert on table "public"."subscription_usages" to "service_role";

grant references on table "public"."subscription_usages" to "service_role";

grant select on table "public"."subscription_usages" to "service_role";

grant trigger on table "public"."subscription_usages" to "service_role";

grant truncate on table "public"."subscription_usages" to "service_role";

grant update on table "public"."subscription_usages" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."usage_log_events" to "anon";

grant insert on table "public"."usage_log_events" to "anon";

grant references on table "public"."usage_log_events" to "anon";

grant select on table "public"."usage_log_events" to "anon";

grant trigger on table "public"."usage_log_events" to "anon";

grant truncate on table "public"."usage_log_events" to "anon";

grant update on table "public"."usage_log_events" to "anon";

grant delete on table "public"."usage_log_events" to "authenticated";

grant insert on table "public"."usage_log_events" to "authenticated";

grant references on table "public"."usage_log_events" to "authenticated";

grant select on table "public"."usage_log_events" to "authenticated";

grant trigger on table "public"."usage_log_events" to "authenticated";

grant truncate on table "public"."usage_log_events" to "authenticated";

grant update on table "public"."usage_log_events" to "authenticated";

grant delete on table "public"."usage_log_events" to "service_role";

grant insert on table "public"."usage_log_events" to "service_role";

grant references on table "public"."usage_log_events" to "service_role";

grant select on table "public"."usage_log_events" to "service_role";

grant trigger on table "public"."usage_log_events" to "service_role";

grant truncate on table "public"."usage_log_events" to "service_role";

grant update on table "public"."usage_log_events" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "DELETE"
on "public"."application_reports"
as permissive
for delete
to public
using (can_access_enterprise(enterprise_id));


create policy "INSERT"
on "public"."application_reports"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "SELECT"
on "public"."application_reports"
as permissive
for select
to authenticated
using (true);


create policy "UPDATE"
on "public"."application_reports"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


create policy "DELETE"
on "public"."apps"
as permissive
for delete
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "INSERT"
on "public"."apps"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "SELECT"
on "public"."apps"
as permissive
for select
to authenticated
using (true);


create policy "UPDATE"
on "public"."apps"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


create policy "Enable delete for users based on user_id"
on "public"."devices"
as permissive
for delete
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Enable insert for users based on user_id"
on "public"."devices"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "Enable update for users based on email"
on "public"."devices"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


create policy "Enable users to view their own data only"
on "public"."devices"
as permissive
for select
to authenticated
using (true);


create policy "DELETE"
on "public"."devices_histories"
as permissive
for delete
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "INSERT"
on "public"."devices_histories"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "SELECT"
on "public"."devices_histories"
as permissive
for select
to authenticated
using (true);


create policy "UPDATE"
on "public"."devices_histories"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


create policy "Enable delete for users based on enterprise_id"
on "public"."enterprises"
as permissive
for delete
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Enable insert for authenticated users only"
on "public"."enterprises"
as permissive
for insert
to authenticated
with check (true);


create policy "Policy SELECT"
on "public"."enterprises"
as permissive
for select
to authenticated
using (true);


create policy "Policy UPDATE"
on "public"."enterprises"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


create policy "DELETE"
on "public"."enterprises_histories"
as permissive
for delete
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Enable insert for authenticated users only"
on "public"."enterprises_histories"
as permissive
for insert
to authenticated
with check (true);


create policy "SELECT"
on "public"."enterprises_histories"
as permissive
for select
to authenticated
using (true);


create policy "UPDATE"
on "public"."enterprises_histories"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


create policy "Enable delete for users based on user_id"
on "public"."memory_events"
as permissive
for delete
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Enable insert for authenticated users only"
on "public"."memory_events"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "Enable read access for all users"
on "public"."memory_events"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for users based on email"
on "public"."memory_events"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


create policy "Enable delete for users based on user_id"
on "public"."operations"
as permissive
for delete
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Enable insert for authenticated users only"
on "public"."operations"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "Enable read access for all users"
on "public"."operations"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for users based on email"
on "public"."operations"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


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


create policy "DELETE"
on "public"."policies_histories"
as permissive
for delete
to authenticated
using (can_access_policy(policy_id));


create policy "INSERT"
on "public"."policies_histories"
as permissive
for insert
to authenticated
with check (true);


create policy "SELECT"
on "public"."policies_histories"
as permissive
for select
to authenticated
using (true);


create policy "UPDATE"
on "public"."policies_histories"
as permissive
for update
to authenticated
using (can_access_policy(policy_id))
with check (can_access_policy(policy_id));


create policy "Enable delete for users based on user_id"
on "public"."power_management_events"
as permissive
for delete
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Enable insert for authenticated users only"
on "public"."power_management_events"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "Enable read access for all users"
on "public"."power_management_events"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for users based on email"
on "public"."power_management_events"
as permissive
for update
to authenticated
using (can_access_enterprise(enterprise_id))
with check (can_access_enterprise(enterprise_id));


create policy "Enable insert for authenticated users only"
on "public"."project_members"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to view their own data only"
on "public"."project_members"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."projects"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Enable insert for authenticated users only"
on "public"."projects"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to view their own data only"
on "public"."projects"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = owner_id) OR can_access_project(project_id)));


create policy "Policy with table joins"
on "public"."projects"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id));


create policy "INSERT"
on "public"."pubsub_messages"
as permissive
for insert
to authenticated
with check ((auth.role() = 'service_role'::text));


create policy "SELECT"
on "public"."pubsub_messages"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Only admins can insert subscription plans"
on "public"."subscription_plans"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM subscriptions
  WHERE ((subscriptions.subscription_id = subscription_plans.subscription_id) AND (subscriptions.owner_id = ( SELECT auth.uid() AS uid))))));


create policy "Users can view their own subscription plans"
on "public"."subscription_plans"
as permissive
for select
to public
using ((subscription_id IN ( SELECT subscriptions.subscription_id
   FROM subscriptions
  WHERE (subscriptions.owner_id = ( SELECT auth.uid() AS uid)))));


create policy "Users can update their own subscription usages"
on "public"."subscription_usages"
as permissive
for update
to public
using ((subscription_id IN ( SELECT subscriptions.subscription_id
   FROM subscriptions
  WHERE (subscriptions.owner_id = ( SELECT auth.uid() AS uid)))));


create policy "Users can view their own subscription usages"
on "public"."subscription_usages"
as permissive
for select
to public
using ((subscription_id IN ( SELECT subscriptions.subscription_id
   FROM subscriptions
  WHERE (subscriptions.owner_id = ( SELECT auth.uid() AS uid)))));


create policy "Policy with security definer functions"
on "public"."subscriptions"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id))
with check ((( SELECT auth.uid() AS uid) = owner_id));


create policy "INSERT"
on "public"."usage_log_events"
as permissive
for insert
to authenticated
with check ((auth.role() = 'service_role'::text));


create policy "SELECT"
on "public"."usage_log_events"
as permissive
for select
to authenticated
using (can_access_usage_log_events(pubsub_message_id));


create policy "Policy with security definer functions"
on "public"."users"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER trigger_set_device_display_name_with_fallback BEFORE INSERT ON public.devices FOR EACH ROW EXECUTE FUNCTION set_device_display_name_with_fallback();



