create table "public"."apps" (
    "app_id" uuid not null default gen_random_uuid(),
    "package_name" text not null,
    "enterprise_id" text not null,
    "app_type" text not null,
    "app_details" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."apps" enable row level security;

create table "public"."device_application_reports" (
    "application_report_id" uuid not null default gen_random_uuid(),
    "device_uuid" uuid not null,
    "report_data" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."device_application_reports" enable row level security;

create table "public"."device_hardware_metrics" (
    "hardware_metrics_id" uuid not null default gen_random_uuid(),
    "device_uuid" uuid not null,
    "measured_at" timestamp with time zone not null,
    "metrics" jsonb not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."device_hardware_metrics" enable row level security;

create table "public"."device_history" (
    "device_history_id" uuid not null default gen_random_uuid(),
    "device_uuid" uuid not null,
    "request_details" jsonb,
    "response_details" jsonb not null,
    "updated_by_user_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."device_history" enable row level security;

create table "public"."device_memory_events" (
    "memory_event_id" uuid not null default gen_random_uuid(),
    "device_uuid" uuid not null,
    "measured_at" timestamp with time zone not null,
    "event_type" text not null,
    "byte_count" bigint,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."device_memory_events" enable row level security;

create table "public"."device_operations" (
    "operation_id" uuid not null default gen_random_uuid(),
    "operation_type" text,
    "operation_name" text,
    "operation_request_data" jsonb,
    "operation_response_data" jsonb not null,
    "created_by_user_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "completed_at" timestamp with time zone,
    "enterprise_id" text not null,
    "device_id" text not null
);


alter table "public"."device_operations" enable row level security;

create table "public"."device_power_events" (
    "power_events_id" uuid not null default gen_random_uuid(),
    "device_uuid" uuid not null,
    "measured_at" timestamp with time zone not null,
    "event_type" text not null,
    "battery_level" smallint
);


alter table "public"."device_power_events" enable row level security;

create table "public"."devices" (
    "id" uuid not null default gen_random_uuid(),
    "enterprise_id" text not null,
    "device_id" text not null,
    "device_display_name" text,
    "is_licensed" boolean not null default false,
    "device_details" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "policy_id" uuid,
    "requested_policy_id" uuid,
    "last_operation_id" uuid
);


alter table "public"."devices" enable row level security;

create table "public"."enterprise_history" (
    "enterprise_history_id" uuid not null default gen_random_uuid(),
    "enterprise_id" text not null,
    "request_details" jsonb not null,
    "created_by_user_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "response_details" jsonb not null
);


alter table "public"."enterprise_history" enable row level security;

create table "public"."enterprises" (
    "enterprise_id" text not null,
    "subscription_owner_id" uuid not null default auth.uid(),
    "enterprise_details" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."enterprises" enable row level security;

create table "public"."policies" (
    "policy_id" uuid not null default gen_random_uuid(),
    "enterprise_id" text not null,
    "policy_display_name" text not null default 'Unknown'::text,
    "policy_details" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "is_default" boolean not null default false
);


alter table "public"."policies" enable row level security;

create table "public"."policy_history" (
    "policy_history_id" uuid not null default gen_random_uuid(),
    "policy_id" uuid not null,
    "request_details" jsonb not null,
    "response_details" jsonb not null,
    "updated_by_user_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."policy_history" enable row level security;

create table "public"."project_members" (
    "project_member_id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "role" text not null
);


alter table "public"."project_members" enable row level security;

create table "public"."projects" (
    "project_id" uuid not null default gen_random_uuid(),
    "subscription_owner_id" uuid not null default auth.uid(),
    "project_name" text not null,
    "organization_name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "enterprise_id" text,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."projects" enable row level security;

create table "public"."pubsub_message_logs" (
    "id" bigint generated by default as identity not null,
    "message" jsonb,
    "message_attributes" jsonb,
    "message_id" text,
    "publish_time" timestamp with time zone,
    "ordering_key" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."pubsub_message_logs" enable row level security;

create table "public"."pubsub_messages" (
    "message_id" text not null,
    "enterprise_id" text,
    "device_id" text,
    "notification_type" text not null,
    "message" jsonb not null,
    "message_attributes" jsonb not null,
    "publish_time" timestamp with time zone not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."pubsub_messages" enable row level security;

create table "public"."service_limits" (
    "service_limit_id" uuid not null default gen_random_uuid(),
    "max_total_users" integer not null,
    "max_projects_per_user" integer not null,
    "max_devices_kitting_per_user" integer not null,
    "max_policies_per_user" integer not null,
    "max_ssids_per_user" integer not null,
    "max_managed_apps_per_user" integer not null,
    "max_app_configs_per_app" integer not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."service_limits" enable row level security;

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
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."subscriptions" enable row level security;

create table "public"."usage_log_events" (
    "event_id" uuid not null default gen_random_uuid(),
    "message_id" text not null,
    "event_time" timestamp with time zone not null,
    "event_type" text not null,
    "event_details" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "device_id" text,
    "enterprise_id" text
);


alter table "public"."usage_log_events" enable row level security;

create table "public"."users" (
    "user_id" uuid not null default auth.uid(),
    "email" text not null,
    "username" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "agree_to_terms" boolean not null default false
);


alter table "public"."users" enable row level security;

create table "public"."waiting_users" (
    "user_id" uuid not null default gen_random_uuid(),
    "username" text not null,
    "email" text not null,
    "status" text not null default 'waiting'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."waiting_users" enable row level security;

create table "public"."wifi_configurations" (
    "configuration_id" uuid not null default gen_random_uuid(),
    "enterprise_id" text not null,
    "configuration_details" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."wifi_configurations" enable row level security;

CREATE UNIQUE INDEX application_reports_pkey ON public.device_application_reports USING btree (application_report_id);

CREATE UNIQUE INDEX apps_package_name_enterprise_unique ON public.apps USING btree (enterprise_id, package_name);

CREATE UNIQUE INDEX apps_pkey ON public.apps USING btree (app_id);

CREATE UNIQUE INDEX device_application_reports_device_uuid_unique ON public.device_application_reports USING btree (device_uuid);

CREATE UNIQUE INDEX device_hardware_metrics_device_uuid_measured_at_key ON public.device_hardware_metrics USING btree (device_uuid, measured_at);

CREATE UNIQUE INDEX device_hardware_metrics_pkey ON public.device_hardware_metrics USING btree (hardware_metrics_id);

CREATE UNIQUE INDEX device_history_pkey ON public.device_history USING btree (device_history_id);

CREATE UNIQUE INDEX device_memory_events_device_uuid_measured_at_unique ON public.device_memory_events USING btree (device_uuid, measured_at);

CREATE UNIQUE INDEX device_operations_pkey ON public.device_operations USING btree (operation_id);

CREATE UNIQUE INDEX device_power_events_device_uuid_measured_at_unique ON public.device_power_events USING btree (device_uuid, measured_at);

CREATE UNIQUE INDEX device_power_events_pkey ON public.device_power_events USING btree (power_events_id);

CREATE UNIQUE INDEX devices_enterprise_device_unique ON public.devices USING btree (enterprise_id, device_id);

CREATE UNIQUE INDEX devices_pkey ON public.devices USING btree (id);

CREATE UNIQUE INDEX enterprise_history_pkey ON public.enterprise_history USING btree (enterprise_history_id);

CREATE UNIQUE INDEX enterprises_pkey ON public.enterprises USING btree (enterprise_id);

CREATE INDEX idx_apps_enterprise_id ON public.apps USING btree (enterprise_id);

CREATE INDEX idx_device_memory_events_device_uuid ON public.device_memory_events USING btree (device_uuid);

CREATE INDEX idx_device_operations_enterprise_device_id ON public.device_operations USING btree (enterprise_id, device_id);

CREATE INDEX idx_device_power_events_device_uuid ON public.device_power_events USING btree (device_uuid);

CREATE INDEX idx_devices_enterprise_id ON public.devices USING btree (enterprise_id);

CREATE INDEX idx_policies_enterprise_id ON public.policies USING btree (enterprise_id);

CREATE INDEX idx_policies_is_default ON public.policies USING btree (is_default);

CREATE INDEX idx_project_members_user_project ON public.project_members USING btree (user_id, project_id);

CREATE INDEX idx_projects_enterprise_id ON public.projects USING btree (enterprise_id);

CREATE INDEX idx_projects_subscription_owner_id ON public.projects USING btree (subscription_owner_id);

CREATE INDEX idx_pubsub_messages_enterprise_device ON public.pubsub_messages USING btree (enterprise_id, device_id);

CREATE INDEX idx_pubsub_messages_enterprise_id ON public.pubsub_messages USING btree (enterprise_id);

CREATE INDEX idx_subscription_plans_subscription_id ON public.subscription_plans USING btree (subscription_id);

CREATE INDEX idx_subscription_usages_subscription_id ON public.subscription_usages USING btree (subscription_id);

CREATE INDEX idx_usage_log_events_device_id ON public.usage_log_events USING btree (device_id);

CREATE INDEX idx_usage_log_events_enterprise_id ON public.usage_log_events USING btree (enterprise_id);

CREATE INDEX idx_wifi_configurations_enterprise_id ON public.wifi_configurations USING btree (enterprise_id);

CREATE UNIQUE INDEX memory_events_pkey ON public.device_memory_events USING btree (memory_event_id);

CREATE UNIQUE INDEX policies_enterprise_display_name_unique ON public.policies USING btree (enterprise_id, policy_display_name);

CREATE UNIQUE INDEX policies_pkey ON public.policies USING btree (policy_id);

CREATE UNIQUE INDEX policy_history_pkey ON public.policy_history USING btree (policy_history_id);

CREATE UNIQUE INDEX project_members_pkey ON public.project_members USING btree (project_member_id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (project_id);

CREATE UNIQUE INDEX pubsub_message_logs_pkey ON public.pubsub_message_logs USING btree (id);

CREATE UNIQUE INDEX pubsub_messages_pkey ON public.pubsub_messages USING btree (message_id);

CREATE UNIQUE INDEX service_limits_pkey ON public.service_limits USING btree (service_limit_id);

CREATE UNIQUE INDEX subscription_plans_pkey ON public.subscription_plans USING btree (plan_id);

CREATE UNIQUE INDEX subscription_usages_pkey ON public.subscription_usages USING btree (usage_id);

CREATE UNIQUE INDEX subscriptions_owner_id_key ON public.subscriptions USING btree (owner_id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (subscription_id);

CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key ON public.subscriptions USING btree (stripe_subscription_id);

CREATE UNIQUE INDEX unique_default_policy_per_enterprise ON public.policies USING btree (enterprise_id) WHERE (is_default = true);

CREATE UNIQUE INDEX unique_subscription_plan ON public.subscription_plans USING btree (subscription_id);

CREATE UNIQUE INDEX unique_subscription_usage ON public.subscription_usages USING btree (subscription_id);

CREATE UNIQUE INDEX usage_log_events_pkey ON public.usage_log_events USING btree (event_id);

CREATE UNIQUE INDEX usernames_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX usernames_username_key ON public.users USING btree (username);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (user_id);

CREATE UNIQUE INDEX waiting_users_email_key ON public.waiting_users USING btree (email);

CREATE UNIQUE INDEX waiting_users_pkey ON public.waiting_users USING btree (user_id);

CREATE UNIQUE INDEX waiting_users_username_key ON public.waiting_users USING btree (username);

CREATE UNIQUE INDEX wifi_configurations_pkey ON public.wifi_configurations USING btree (configuration_id);

alter table "public"."apps" add constraint "apps_pkey" PRIMARY KEY using index "apps_pkey";

alter table "public"."device_application_reports" add constraint "application_reports_pkey" PRIMARY KEY using index "application_reports_pkey";

alter table "public"."device_hardware_metrics" add constraint "device_hardware_metrics_pkey" PRIMARY KEY using index "device_hardware_metrics_pkey";

alter table "public"."device_history" add constraint "device_history_pkey" PRIMARY KEY using index "device_history_pkey";

alter table "public"."device_memory_events" add constraint "memory_events_pkey" PRIMARY KEY using index "memory_events_pkey";

alter table "public"."device_operations" add constraint "device_operations_pkey" PRIMARY KEY using index "device_operations_pkey";

alter table "public"."device_power_events" add constraint "device_power_events_pkey" PRIMARY KEY using index "device_power_events_pkey";

alter table "public"."devices" add constraint "devices_pkey" PRIMARY KEY using index "devices_pkey";

alter table "public"."enterprise_history" add constraint "enterprise_history_pkey" PRIMARY KEY using index "enterprise_history_pkey";

alter table "public"."enterprises" add constraint "enterprises_pkey" PRIMARY KEY using index "enterprises_pkey";

alter table "public"."policies" add constraint "policies_pkey" PRIMARY KEY using index "policies_pkey";

alter table "public"."policy_history" add constraint "policy_history_pkey" PRIMARY KEY using index "policy_history_pkey";

alter table "public"."project_members" add constraint "project_members_pkey" PRIMARY KEY using index "project_members_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."pubsub_message_logs" add constraint "pubsub_message_logs_pkey" PRIMARY KEY using index "pubsub_message_logs_pkey";

alter table "public"."pubsub_messages" add constraint "pubsub_messages_pkey" PRIMARY KEY using index "pubsub_messages_pkey";

alter table "public"."service_limits" add constraint "service_limits_pkey" PRIMARY KEY using index "service_limits_pkey";

alter table "public"."subscription_plans" add constraint "subscription_plans_pkey" PRIMARY KEY using index "subscription_plans_pkey";

alter table "public"."subscription_usages" add constraint "subscription_usages_pkey" PRIMARY KEY using index "subscription_usages_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."usage_log_events" add constraint "usage_log_events_pkey" PRIMARY KEY using index "usage_log_events_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."waiting_users" add constraint "waiting_users_pkey" PRIMARY KEY using index "waiting_users_pkey";

alter table "public"."wifi_configurations" add constraint "wifi_configurations_pkey" PRIMARY KEY using index "wifi_configurations_pkey";

alter table "public"."apps" add constraint "apps_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."apps" validate constraint "apps_enterprise_id_fkey";

alter table "public"."apps" add constraint "apps_package_name_enterprise_unique" UNIQUE using index "apps_package_name_enterprise_unique";

alter table "public"."device_application_reports" add constraint "application_reports_device_uuid_fkey" FOREIGN KEY (device_uuid) REFERENCES devices(id) ON DELETE CASCADE not valid;

alter table "public"."device_application_reports" validate constraint "application_reports_device_uuid_fkey";

alter table "public"."device_application_reports" add constraint "device_application_reports_device_uuid_unique" UNIQUE using index "device_application_reports_device_uuid_unique";

alter table "public"."device_hardware_metrics" add constraint "device_hardware_metrics_device_uuid_fkey" FOREIGN KEY (device_uuid) REFERENCES devices(id) ON DELETE CASCADE not valid;

alter table "public"."device_hardware_metrics" validate constraint "device_hardware_metrics_device_uuid_fkey";

alter table "public"."device_hardware_metrics" add constraint "device_hardware_metrics_device_uuid_measured_at_key" UNIQUE using index "device_hardware_metrics_device_uuid_measured_at_key";

alter table "public"."device_history" add constraint "device_history_updated_by_user_id_fkey" FOREIGN KEY (updated_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."device_history" validate constraint "device_history_updated_by_user_id_fkey";

alter table "public"."device_history" add constraint "devices_histories_device_uuid_fkey" FOREIGN KEY (device_uuid) REFERENCES devices(id) ON DELETE CASCADE not valid;

alter table "public"."device_history" validate constraint "devices_histories_device_uuid_fkey";

alter table "public"."device_memory_events" add constraint "device_memory_events_device_uuid_measured_at_unique" UNIQUE using index "device_memory_events_device_uuid_measured_at_unique";

alter table "public"."device_memory_events" add constraint "memory_events_device_uuid_fkey" FOREIGN KEY (device_uuid) REFERENCES devices(id) ON DELETE CASCADE not valid;

alter table "public"."device_memory_events" validate constraint "memory_events_device_uuid_fkey";

alter table "public"."device_operations" add constraint "device_operations_created_by_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."device_operations" validate constraint "device_operations_created_by_user_id_fkey";

alter table "public"."device_operations" add constraint "device_operations_enterprise_device_fkey" FOREIGN KEY (enterprise_id, device_id) REFERENCES devices(enterprise_id, device_id) ON DELETE CASCADE not valid;

alter table "public"."device_operations" validate constraint "device_operations_enterprise_device_fkey";

alter table "public"."device_power_events" add constraint "device_power_events_device_uuid_measured_at_unique" UNIQUE using index "device_power_events_device_uuid_measured_at_unique";

alter table "public"."device_power_events" add constraint "power_management_events_device_uuid_fkey" FOREIGN KEY (device_uuid) REFERENCES devices(id) ON DELETE CASCADE not valid;

alter table "public"."device_power_events" validate constraint "power_management_events_device_uuid_fkey";

alter table "public"."devices" add constraint "devices_enterprise_device_unique" UNIQUE using index "devices_enterprise_device_unique";

alter table "public"."devices" add constraint "devices_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."devices" validate constraint "devices_enterprise_id_fkey";

alter table "public"."devices" add constraint "devices_last_operation_id_fkey" FOREIGN KEY (last_operation_id) REFERENCES device_operations(operation_id) ON DELETE SET NULL not valid;

alter table "public"."devices" validate constraint "devices_last_operation_id_fkey";

alter table "public"."devices" add constraint "devices_policy_id_fkey" FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE SET NULL not valid;

alter table "public"."devices" validate constraint "devices_policy_id_fkey";

alter table "public"."devices" add constraint "devices_requested_policy_id_fkey" FOREIGN KEY (requested_policy_id) REFERENCES policies(policy_id) ON DELETE SET NULL not valid;

alter table "public"."devices" validate constraint "devices_requested_policy_id_fkey";

alter table "public"."enterprise_history" add constraint "enterprise_history_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."enterprise_history" validate constraint "enterprise_history_enterprise_id_fkey";

alter table "public"."enterprise_history" add constraint "enterprise_history_user_id_fkey" FOREIGN KEY (created_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."enterprise_history" validate constraint "enterprise_history_user_id_fkey";

alter table "public"."enterprises" add constraint "enterprises_subscription_owner_id_fkey" FOREIGN KEY (subscription_owner_id) REFERENCES subscriptions(owner_id) ON DELETE RESTRICT not valid;

alter table "public"."enterprises" validate constraint "enterprises_subscription_owner_id_fkey";

alter table "public"."policies" add constraint "policies_enterprise_display_name_unique" UNIQUE using index "policies_enterprise_display_name_unique";

alter table "public"."policies" add constraint "policies_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."policies" validate constraint "policies_enterprise_id_fkey";

alter table "public"."policy_history" add constraint "policy_history_policy_id_fkey" FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE not valid;

alter table "public"."policy_history" validate constraint "policy_history_policy_id_fkey";

alter table "public"."policy_history" add constraint "policy_history_updated_by_user_id_fkey" FOREIGN KEY (updated_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."policy_history" validate constraint "policy_history_updated_by_user_id_fkey";

alter table "public"."project_members" add constraint "project_members_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE not valid;

alter table "public"."project_members" validate constraint "project_members_project_id_fkey";

alter table "public"."project_members" add constraint "project_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."project_members" validate constraint "project_members_user_id_fkey";

alter table "public"."projects" add constraint "projects_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_enterprise_id_fkey";

alter table "public"."projects" add constraint "projects_subscription_owner_id_fkey" FOREIGN KEY (subscription_owner_id) REFERENCES subscriptions(owner_id) ON DELETE RESTRICT not valid;

alter table "public"."projects" validate constraint "projects_subscription_owner_id_fkey";

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

alter table "public"."usage_log_events" add constraint "usage_log_events_enterprise_id_device_id_fkey" FOREIGN KEY (enterprise_id, device_id) REFERENCES devices(enterprise_id, device_id) ON DELETE CASCADE not valid;

alter table "public"."usage_log_events" validate constraint "usage_log_events_enterprise_id_device_id_fkey";

alter table "public"."usage_log_events" add constraint "usage_log_events_message_id_fkey" FOREIGN KEY (message_id) REFERENCES pubsub_messages(message_id) ON DELETE CASCADE not valid;

alter table "public"."usage_log_events" validate constraint "usage_log_events_message_id_fkey";

alter table "public"."users" add constraint "usernames_email_key" UNIQUE using index "usernames_email_key";

alter table "public"."users" add constraint "usernames_username_key" UNIQUE using index "usernames_username_key";

alter table "public"."users" add constraint "users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_user_id_fkey";

alter table "public"."waiting_users" add constraint "waiting_users_email_key" UNIQUE using index "waiting_users_email_key";

alter table "public"."waiting_users" add constraint "waiting_users_username_key" UNIQUE using index "waiting_users_username_key";

alter table "public"."wifi_configurations" add constraint "wifi_configurations_enterprise_id_fkey" FOREIGN KEY (enterprise_id) REFERENCES enterprises(enterprise_id) ON DELETE CASCADE not valid;

alter table "public"."wifi_configurations" validate constraint "wifi_configurations_enterprise_id_fkey";

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

CREATE OR REPLACE FUNCTION public.get_accessible_enterprises()
 RETURNS SETOF text
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  WITH current_user_id AS MATERIALIZED (
    SELECT auth.uid() AS uid
  )
  SELECT DISTINCT p.enterprise_id
  FROM public.projects p
  LEFT JOIN public.project_members pm ON pm.project_id = p.project_id,
  current_user_id  -- CTEをFROM句で参照
  WHERE 
    p.enterprise_id IS NOT NULL
    AND (
      p.subscription_owner_id = current_user_id.uid
      OR 
      pm.user_id = current_user_id.uid
    );
$function$
;

CREATE OR REPLACE FUNCTION public.has_device_access(device_uuid_param uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT public.has_enterprise_access(d.enterprise_id)
  FROM public.devices d
  WHERE d.id = device_uuid_param;
$function$
;

CREATE OR REPLACE FUNCTION public.has_enterprise_access(enterprise_id_param text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  WITH current_user_id AS MATERIALIZED (
    SELECT auth.uid() AS uid
  )
  SELECT EXISTS (
    SELECT 1
    FROM public.projects p
    LEFT JOIN public.project_members pm ON pm.project_id = p.project_id,
    current_user_id  -- CTEをFROM句で参照
    WHERE p.enterprise_id = enterprise_id_param
    AND (
      p.subscription_owner_id = current_user_id.uid
      OR 
      pm.user_id = current_user_id.uid
    )
  );
$function$
;

CREATE OR REPLACE FUNCTION public.has_policy_access(policy_id_param uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT public.has_enterprise_access(p.enterprise_id)
  FROM public.policies p
  WHERE p.policy_id = policy_id_param;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_or_upsert_devices_data(devices jsonb[], device_hardware_metrics jsonb[], device_memory_events jsonb[], device_power_events jsonb[], device_application_reports jsonb[], device_history jsonb[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$

begin
  -- トランザクション分離レベルとタイムアウトの設定
  set local transaction isolation level read committed;
  set local lock_timeout = '10s';

  begin
    -- デバイスデータの更新（最初に実行）
    CREATE TEMP TABLE updated_devices (id uuid, device_id text);
    
      insert into public.devices (
        enterprise_id,
        device_id,
        policy_id,
        requested_policy_id,
        device_details,
        updated_at
      )
      select
        (d->>'enterprise_id')::text,
        (d->>'device_id')::text,
        (d->>'policy_id')::text,
        (d->>'requested_policy_id')::text,
        (d->>'device_details')::jsonb,
        (d->>'updated_at')::timestamp with time zone
      from unnest(devices) as d
      on conflict (enterprise_id,device_id)
      do update set
        policy_id = excluded.policy_id,
        requested_policy_id = excluded.requested_policy_id,
        device_details = excluded.device_details,
        updated_at = excluded.updated_at
      RETURNING id, device_id;
    
    begin
    -- ハードウェア情報の更新（2番目）
      insert into public.device_hardware_metrics (
        device_uuid,
        metrics,
        measured_at
      )
      select
        ud.id,
        (d->>'metrics')::jsonb,
        (d->>'measured_at')::timestamp with time zone
      from unnest(device_hardware_metrics) as d
      JOIN updated_devices ud ON ud.device_id = (d->>'device_id')::text
      on conflict (device_uuid, measured_at)
      do nothing;  -- 既存データの場合はスキップ
    exception
      when others then
        raise warning 'Failed to insert hardware metrics data: %', SQLERRM;
    end;

    begin
      -- メモリイベントの更新（３番目）
      insert into public.device_memory_events (
        device_uuid,
        measured_at,
        event_type,
        byte_count
      )
      select
        ud.id,
        (d->>'measured_at')::timestamp with time zone,
        (d->>'event_type')::text,
        (d->>'byte_count')::bigint
      from unnest(device_memory_events) as d
      JOIN updated_devices ud ON ud.device_id = (d->>'device_id')::text
      on conflict (device_uuid,measured_at)
      do nothing;  -- 既存データの場合はスキップ
    exception
      when others then
        raise warning 'Failed to insert memory event data: %', SQLERRM;
    end;

    begin
      -- 電源管理イベントの更新（４番目）
      insert into public.device_power_events (
        device_uuid,
        measured_at,
        event_type,
        battery_level
      )
      select
        ud.id,
        (d->>'measured_at')::timestamp with time zone,
        (d->>'event_type')::text,
        (d->>'battery_level')::smallint
      from unnest(device_power_events) as d
      JOIN updated_devices ud ON ud.device_id = (d->>'device_id')::text
      on conflict (device_uuid,measured_at)
      do nothing;  -- 既存データの場合はスキップ
    exception
      when others then
        raise warning 'Failed to insert device_power_events event data: %', SQLERRM;
    end;

    begin
      -- アプリケーションレポートの更新（５番目）
      insert into public.device_application_reports (
        device_uuid,
        report_data,
        updated_at
      )
      select
        ud.id,
        (d->>'application_report_data')::jsonb,
        (d->>'updated_at')::timestamp with time zone
      from unnest(device_application_reports) as d
      JOIN updated_devices ud ON ud.device_id = (d->>'device_id')::text
      on conflict (device_uuid)
      do update set
        report_data = excluded.report_data,
        updated_at = excluded.updated_at;
    exception
      when others then
        raise warning 'Failed to insert device_application_reports data: %', SQLERRM;
    end;

  begin  -- device_historyにも例外処理を追加
    -- デバイス履歴の挿入（最後に実行）
    insert into device_history (
      device_uuid,
      response_details
    )
    select
      ud.id,
      (d->>'response_details')::jsonb
    from unnest(device_history) as d
    JOIN updated_devices ud ON ud.device_id = (d->>'device_id')::text;

      -- 処理成功のログ
      raise notice 'Successfully processed device data for % devices', (select count(*) from unnest(devices));
    exception
      when others then
        raise exception 'Failed to insert device history data: %', SQLERRM;  -- 重要なデータなのでexceptionとする
  end;
  
  -- 最後の例外処理ブロックの前に追加
  DROP TABLE IF EXISTS updated_devices;

  exception
    when lock_not_available then
      DROP TABLE IF EXISTS updated_devices; -- 例外時にも削除
      raise exception 'Lock timeout occurred: Could not acquire necessary locks within 10 seconds';
    when deadlock_detected then
      DROP TABLE IF EXISTS updated_devices; -- 例外時にも削除
      raise exception 'Deadlock detected: Transaction was chosen as deadlock victim';
    when others then
      DROP TABLE IF EXISTS updated_devices; -- 例外時にも削除
      raise exception 'Transaction failed: %', SQLERRM;
  end;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_or_upsert_devices_data_old(devices jsonb[], application_reports jsonb[], memory_events jsonb[], power_management_events jsonb[], device_histories jsonb[], device_displays jsonb[], device_hardware_status jsonb[], device_metrics jsonb[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$begin
  -- トランザクション分離レベルとタイムアウトの設定
  set local transaction isolation level read committed;
  set local lock_timeout = '10s';

  begin
    -- デバイスデータの更新（最初に実行）
    insert into public.devices (
      enterprise_id,
      device_identifier,
      policy_identifier,
      requested_policy_identifier,
      device_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'policy_identifier')::text,
      (d->>'requested_policy_identifier')::text,
      (d->>'device_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(devices) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      policy_identifier = excluded.policy_identifier,
      requested_policy_identifier = excluded.requested_policy_identifier,
      device_data = excluded.device_data,
      updated_at = excluded.updated_at;

    -- ディスプレイ情報の更新（2番目）
  begin
    insert into public.device_displays (
      enterprise_id,
      device_identifier,
      last_status_report_time,
      displays
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'last_status_report_time')::timestamp with time zone,
      case when (d->>'displays') is null then null
        else array(select elem from jsonb_array_elements(d->'displays') as elem)
      end
    from unnest(device_displays) as d
    where (d->>'last_status_report_time') is not null  -- nullの場合はスキップ
      and (d->>'last_status_report_time')::text != ''  -- 空文字の場合もスキッ
    on conflict (enterprise_id, device_identifier, last_status_report_time) 
    do nothing;  -- 既存データの場合はスキップ
  exception
    when others then
      -- ディスプレイ情報のエラーをログに記録するが、トランザクションは継続
      raise warning 'Failed to insert display data: %', SQLERRM;
  end;

    -- ハードウェア情報の更新（3番目）
  begin
    insert into public.device_hardware_status (
      enterprise_id,
      device_identifier,
      create_time,
      hardware_status
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'create_time')::timestamp with time zone,
      (d->>'hardware_status')::jsonb
    from unnest(device_hardware_status) as d
    on conflict (enterprise_id, device_identifier, create_time)
    do nothing;  -- 既存データの場合はスキップ
  exception
    when others then
      raise warning 'Failed to insert hardware status data: %', SQLERRM;
  end;

    -- ハードウェア情報の更新（3.5番目）
  begin
    insert into public.device_metrics (
      enterprise_id,
      device_identifier,
      create_time,
      battery_temperatures,
      cpu_temperatures,
      gpu_temperatures,
      skin_temperatures,
      cpu_usages,
      fan_speeds
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'create_time')::timestamp with time zone,
      case when (d->>'battery_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'battery_temperatures')::double precision)
      end,
      case when (d->>'cpu_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'cpu_temperatures')::double precision)
      end,
      case when (d->>'gpu_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'gpu_temperatures')::double precision)
      end,
      case when (d->>'skin_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'skin_temperatures')::double precision)
      end,
      case when (d->>'cpu_usages') is null then null
        else array(select jsonb_array_elements_text(d->'cpu_usages')::double precision)
      end,
      case when (d->>'fan_speeds') is null then null
        else array(select jsonb_array_elements_text(d->'fan_speeds')::double precision)
      end
    from unnest(device_metrics) as d
    on conflict (enterprise_id, device_identifier, create_time) 
    do nothing;
  exception
    when others then
      raise warning 'Failed to insert hardware metrics data: %', SQLERRM;
  end;

  begin
    -- メモリイベントの更新（4番目）
    insert into public.memory_events (
      enterprise_id,
      device_identifier,
      create_time,
      event_type,
      byte_count
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'create_time')::timestamp with time zone,
      (d->>'event_type')::text,
      (d->>'byte_count')::bigint
    from unnest(memory_events) as d
    on conflict (enterprise_id,device_identifier,create_time)
    do nothing;  -- 既存データの場合はスキップ
  exception
    when others then
      raise warning 'Failed to insert memory event data: %', SQLERRM;
  end;

  begin
    -- 電源管理イベントの更新（7番目）
    insert into public.power_management_events (
      enterprise_id,
      device_identifier,
      create_time,
      event_type,
      battery_level
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'create_time')::timestamp with time zone,
      (d->>'event_type')::text,
      (d->>'battery_level')::smallint
    from unnest(power_management_events) as d
    on conflict (enterprise_id,device_identifier,create_time)
    do nothing;  -- 既存データの場合はスキップ
  exception
    when others then
      raise warning 'Failed to insert power_management_events event data: %', SQLERRM;
  end;

    -- アプリケーションレポートの更新（6番目）
    insert into public.application_reports (
      enterprise_id,
      device_identifier,
      application_report_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'application_report_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(application_reports) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      application_report_data = excluded.application_report_data,
      updated_at = excluded.updated_at;

    -- デバイス履歴の挿入（最後に実行）
    insert into devices_histories (
      enterprise_id,
      device_identifier,
      device_response_data
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'device_response_data')::jsonb
    from unnest(device_histories) as d;

  exception
    when lock_not_available then
      raise exception 'Lock timeout occurred: Could not acquire necessary locks within 10 seconds';
    when deadlock_detected then
      raise exception 'Deadlock detected: Transaction was chosen as deadlock victim';
    when others then
      raise exception 'Transaction failed: %', SQLERRM;
  end;
end;$function$
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

CREATE OR REPLACE FUNCTION public.upsert_device_data_old(devices jsonb[], application_reports jsonb[], memory_events jsonb[], power_management_events jsonb[], device_histories jsonb[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$begin
  -- トランザクション分離レベル（デフォルト値のまま）とタイムアウトの設定
  set local transaction isolation level read committed;
  set local lock_timeout = '5s';

  -- トランザクション開始
  begin
    -- デバイスデータの更新（最初に実行）
    insert into public.devices (
      enterprise_id,
      device_identifier,
      policy_identifier,
      device_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'policy_identifier')::text,
      (d->>'device_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(devices) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      policy_identifier = excluded.policy_identifier,
      device_data = excluded.device_data,
      updated_at = excluded.updated_at;

    -- アプリケーションレポートの更新（2番目）
    insert into public.application_reports (
      enterprise_id,
      device_identifier,
      application_report_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'application_report_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(application_reports) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      application_report_data = excluded.application_report_data,
      updated_at = excluded.updated_at;

    -- メモリイベントの更新（3番目）
    insert into public.memory_events (
      enterprise_id,
      device_identifier,
      memory_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'memory_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(memory_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      memory_event_data = excluded.memory_event_data,
      updated_at = excluded.updated_at;

    -- 電源管理イベントの更新（4番目）
    insert into public.power_management_events (
      enterprise_id,
      device_identifier,
      power_management_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'power_management_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(power_management_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      power_management_event_data = excluded.power_management_event_data,
      updated_at = excluded.updated_at;

    -- デバイス履歴の挿入（最後に実行）
    insert into devices_histories (
      enterprise_id,
      device_identifier,
      device_response_data
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
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
end;$function$
;

CREATE OR REPLACE FUNCTION public.upsert_device_data_old_r1(devices jsonb[], application_reports jsonb[], memory_events jsonb[], power_management_events jsonb[], device_histories jsonb[], device_displays jsonb[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$begin
  -- トランザクション分離レベルとタイムアウトの設定
  set local transaction isolation level read committed;
  set local lock_timeout = '10s';

  begin
    -- デバイスデータの更新（最初に実行）
    insert into public.devices (
      enterprise_id,
      device_identifier,
      policy_identifier,
      device_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'policy_identifier')::text,
      (d->>'device_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(devices) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      policy_identifier = excluded.policy_identifier,
      device_data = excluded.device_data,
      updated_at = excluded.updated_at;

    -- ディスプレイ情報の更新（2番目）
    begin
      insert into public.device_displays (
        enterprise_id,
        device_identifier,
        last_status_report_time,
        displays
      )
      select
        (d->>'enterprise_id')::text,
        (d->>'device_identifier')::text,
        (d->>'last_status_report_time')::timestamp with time zone,
        (d->>'displays')::jsonb
      from unnest(device_displays) as d;
    exception
      when others then
        -- ディスプレイ情報のエラーをログに記録するが、トランザクションは継続
        raise warning 'Failed to insert display data: %', SQLERRM;
    end;

    -- ハードウェア情報の更新（3番目）
    begin
      insert into public.device_hardware_status (
        enterprise_id,
        device_identifier,
        create_time,
        battery_temperatures,
        cpu_temperatures,
        gpu_temperatures,
        skin_temperatures,
        cpu_usages,
        fan_speeds
      )
      select
        (d->>'enterprise_id')::text,
        (d->>'device_identifier')::text,
        (d->>'create_time')::timestamp with time zone,
        (d->>'battery_temperatures')::double precision[],
        (d->>'cpu_temperatures')::double precision[],
        (d->>'gpu_temperatures')::double precision[],
        (d->>'skin_temperatures')::double precision[],
        (d->>'cpu_usages')::double precision[],
        (d->>'fan_speeds')::double precision[]
      from unnest(device_hardware_status) as d
      on conflict (enterprise_id, device_identifier, create_time) 
      do nothing;  -- 既存データの場合はスキップ
    exception
      when others then
        raise warning 'Failed to insert hardware status data: %', SQLERRM;
    end;

    -- アプリケーションレポートの更新（4番目）
    insert into public.application_reports (
      enterprise_id,
      device_identifier,
      application_report_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'application_report_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(application_reports) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      application_report_data = excluded.application_report_data,
      updated_at = excluded.updated_at;

    -- メモリイベントの更新（4番目）
    insert into public.memory_events (
      enterprise_id,
      device_identifier,
      memory_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'memory_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(memory_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      memory_event_data = excluded.memory_event_data,
      updated_at = excluded.updated_at;

    -- 電源管理イベントの更新（5番目）
    insert into public.power_management_events (
      enterprise_id,
      device_identifier,
      power_management_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'power_management_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(power_management_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      power_management_event_data = excluded.power_management_event_data,
      updated_at = excluded.updated_at;

    -- デバイス履歴の挿入（最後に実行）
    insert into devices_histories (
      enterprise_id,
      device_identifier,
      device_response_data
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'device_response_data')::jsonb
    from unnest(device_histories) as d;

  exception
    when lock_not_available then
      raise exception 'Lock timeout occurred: Could not acquire necessary locks within 10 seconds';
    when deadlock_detected then
      raise exception 'Deadlock detected: Transaction was chosen as deadlock victim';
    when others then
      raise exception 'Transaction failed: %', SQLERRM;
  end;
end;$function$
;

CREATE OR REPLACE FUNCTION public.upsert_device_data_old_r2(devices jsonb[], application_reports jsonb[], memory_events jsonb[], power_management_events jsonb[], device_histories jsonb[], device_displays jsonb[], device_hardware_status jsonb[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$begin
  -- トランザクション分離レベルとタイムアウトの設定
  set local transaction isolation level read committed;
  set local lock_timeout = '10s';

  begin
    -- デバイスデータの更新（最初に実行）
    insert into public.devices (
      enterprise_id,
      device_identifier,
      policy_identifier,
      device_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'policy_identifier')::text,
      (d->>'device_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(devices) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      policy_identifier = excluded.policy_identifier,
      device_data = excluded.device_data,
      updated_at = excluded.updated_at;

    -- ディスプレイ情報の更新（2番目）
    insert into public.device_displays (
      enterprise_id,
      device_identifier,
      last_status_report_time,
      displays
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'last_status_report_time')::timestamp with time zone,
      (d->>'displays')::jsonb
    from unnest(device_displays) as d
    on conflict (enterprise_id, device_identifier, last_status_report_time) 
    do nothing;

    -- ハードウェア情報の更新（3番目）
    insert into public.device_hardware_status (
      enterprise_id,
      device_identifier,
      create_time,
      battery_temperatures,
      cpu_temperatures,
      gpu_temperatures,
      skin_temperatures,
      cpu_usages,
      fan_speeds
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'create_time')::timestamp with time zone,
      case when (d->>'battery_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'battery_temperatures')::double precision)
      end,
      case when (d->>'cpu_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'cpu_temperatures')::double precision)
      end,
      case when (d->>'gpu_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'gpu_temperatures')::double precision)
      end,
      case when (d->>'skin_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'skin_temperatures')::double precision)
      end,
      case when (d->>'cpu_usages') is null then null
        else array(select jsonb_array_elements_text(d->'cpu_usages')::double precision)
      end,
      case when (d->>'fan_speeds') is null then null
        else array(select jsonb_array_elements_text(d->'fan_speeds')::double precision)
      end
    from unnest(device_hardware_status) as d
    on conflict (enterprise_id, device_identifier, create_time) 
    do nothing;

    -- アプリケーションレポートの更新（4番目）
    insert into public.application_reports (
      enterprise_id,
      device_identifier,
      application_report_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'application_report_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(application_reports) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      application_report_data = excluded.application_report_data,
      updated_at = excluded.updated_at;

    -- メモリイベントの更新（4番目）
    insert into public.memory_events (
      enterprise_id,
      device_identifier,
      memory_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'memory_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(memory_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      memory_event_data = excluded.memory_event_data,
      updated_at = excluded.updated_at;

    -- 電源管理イベントの更新（5番目）
    insert into public.power_management_events (
      enterprise_id,
      device_identifier,
      power_management_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'power_management_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(power_management_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      power_management_event_data = excluded.power_management_event_data,
      updated_at = excluded.updated_at;

    -- デバイス履歴の挿入（最後に実行）
    insert into devices_histories (
      enterprise_id,
      device_identifier,
      device_response_data
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'device_response_data')::jsonb
    from unnest(device_histories) as d;

  exception
    when lock_not_available then
      raise exception 'Lock timeout occurred: Could not acquire necessary locks within 10 seconds';
    when deadlock_detected then
      raise exception 'Deadlock detected: Transaction was chosen as deadlock victim';
    when others then
      raise exception 'Transaction failed: %', SQLERRM;
  end;
end;$function$
;

CREATE OR REPLACE FUNCTION public.upsert_device_data_old_r3(devices jsonb[], application_reports jsonb[], memory_events jsonb[], power_management_events jsonb[], device_histories jsonb[], device_displays jsonb[], device_hardware_status jsonb[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$begin
  -- トランザクション分離レベルとタイムアウトの設定
  set local transaction isolation level read committed;
  set local lock_timeout = '10s';

  begin
    -- デバイスデータの更新（最初に実行）
    insert into public.devices (
      enterprise_id,
      device_identifier,
      policy_identifier,
      device_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'policy_identifier')::text,
      (d->>'device_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(devices) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      policy_identifier = excluded.policy_identifier,
      device_data = excluded.device_data,
      updated_at = excluded.updated_at;

    -- ディスプレイ情報の更新（2番目）
  begin
    insert into public.device_displays (
      enterprise_id,
      device_identifier,
      last_status_report_time,
      displays
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'last_status_report_time')::timestamp with time zone,
      (d->>'displays')::jsonb
    from unnest(device_displays) as d
    on conflict (enterprise_id, device_identifier, last_status_report_time) 
    do nothing;  -- 既存データの場合はスキップ
  exception
    when others then
      -- ディスプレイ情報のエラーをログに記録するが、トランザクションは継続
      raise warning 'Failed to insert display data: %', SQLERRM;
  end;

    -- ハードウェア情報の更新（3番目）
  begin
    insert into public.device_hardware_status (
      enterprise_id,
      device_identifier,
      create_time,
      hardware_status
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'create_time')::timestamp with time zone,
      (d->>'hardware_status')::jsonb
    from unnest(device_hardware_status) as d
    on conflict (enterprise_id, device_identifier, create_time)
    do nothing;  -- 既存データの場合はスキップ
  exception
    when others then
      raise warning 'Failed to insert hardware status data: %', SQLERRM;
  end;

    -- アプリケーションレポートの更新（4番目）
    insert into public.application_reports (
      enterprise_id,
      device_identifier,
      application_report_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'application_report_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(application_reports) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      application_report_data = excluded.application_report_data,
      updated_at = excluded.updated_at;

    -- メモリイベントの更新（4番目）
    insert into public.memory_events (
      enterprise_id,
      device_identifier,
      memory_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'memory_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(memory_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      memory_event_data = excluded.memory_event_data,
      updated_at = excluded.updated_at;

    -- 電源管理イベントの更新（5番目）
    insert into public.power_management_events (
      enterprise_id,
      device_identifier,
      power_management_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'power_management_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(power_management_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      power_management_event_data = excluded.power_management_event_data,
      updated_at = excluded.updated_at;

    -- デバイス履歴の挿入（最後に実行）
    insert into devices_histories (
      enterprise_id,
      device_identifier,
      device_response_data
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'device_response_data')::jsonb
    from unnest(device_histories) as d;

  exception
    when lock_not_available then
      raise exception 'Lock timeout occurred: Could not acquire necessary locks within 10 seconds';
    when deadlock_detected then
      raise exception 'Deadlock detected: Transaction was chosen as deadlock victim';
    when others then
      raise exception 'Transaction failed: %', SQLERRM;
  end;
end;$function$
;

CREATE OR REPLACE FUNCTION public.upsert_device_data_old_r4(devices jsonb[], application_reports jsonb[], memory_events jsonb[], power_management_events jsonb[], device_histories jsonb[], device_displays jsonb[], device_hardware_status jsonb[], device_metrics jsonb[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$begin
  -- トランザクション分離レベルとタイムアウトの設定
  set local transaction isolation level read committed;
  set local lock_timeout = '10s';

  begin
    -- デバイスデータの更新（最初に実行）
    insert into public.devices (
      enterprise_id,
      device_identifier,
      policy_identifier,
      device_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'policy_identifier')::text,
      (d->>'device_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(devices) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      policy_identifier = excluded.policy_identifier,
      device_data = excluded.device_data,
      updated_at = excluded.updated_at;

    -- ディスプレイ情報の更新（2番目）
  begin
    insert into public.device_displays (
      enterprise_id,
      device_identifier,
      last_status_report_time,
      displays
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'last_status_report_time')::timestamp with time zone,
      (d->>'displays')::jsonb
    from unnest(device_displays) as d
    on conflict (enterprise_id, device_identifier, last_status_report_time) 
    do nothing;  -- 既存データの場合はスキップ
  exception
    when others then
      -- ディスプレイ情報のエラーをログに記録するが、トランザクションは継続
      raise warning 'Failed to insert display data: %', SQLERRM;
  end;

    -- ハードウェア情報の更新（3番目）
  begin
    insert into public.device_hardware_status (
      enterprise_id,
      device_identifier,
      create_time,
      hardware_status
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'create_time')::timestamp with time zone,
      (d->>'hardware_status')::jsonb
    from unnest(device_hardware_status) as d
    on conflict (enterprise_id, device_identifier, create_time)
    do nothing;  -- 既存データの場合はスキップ
  exception
    when others then
      raise warning 'Failed to insert hardware status data: %', SQLERRM;
  end;

  begin
    -- ハードウェア情報の更新（3.5番目）
    insert into public.device_metrics (
      enterprise_id,
      device_identifier,
      create_time,
      battery_temperatures,
      cpu_temperatures,
      gpu_temperatures,
      skin_temperatures,
      cpu_usages,
      fan_speeds
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'create_time')::timestamp with time zone,
      case when (d->>'battery_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'battery_temperatures')::double precision)
      end,
      case when (d->>'cpu_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'cpu_temperatures')::double precision)
      end,
      case when (d->>'gpu_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'gpu_temperatures')::double precision)
      end,
      case when (d->>'skin_temperatures') is null then null
        else array(select jsonb_array_elements_text(d->'skin_temperatures')::double precision)
      end,
      case when (d->>'cpu_usages') is null then null
        else array(select jsonb_array_elements_text(d->'cpu_usages')::double precision)
      end,
      case when (d->>'fan_speeds') is null then null
        else array(select jsonb_array_elements_text(d->'fan_speeds')::double precision)
      end
    from unnest(device_hardware_status) as d
    on conflict (enterprise_id, device_identifier, create_time) 
    do nothing;
  exception
    when others then
      raise warning 'Failed to insert hardware metrics data: %', SQLERRM;
  end;

    -- アプリケーションレポートの更新（4番目）
    insert into public.application_reports (
      enterprise_id,
      device_identifier,
      application_report_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'application_report_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(application_reports) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      application_report_data = excluded.application_report_data,
      updated_at = excluded.updated_at;

    -- メモリイベントの更新（4番目）
    insert into public.memory_events (
      enterprise_id,
      device_identifier,
      memory_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'memory_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(memory_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      memory_event_data = excluded.memory_event_data,
      updated_at = excluded.updated_at;

    -- 電源管理イベントの更新（5番目）
    insert into public.power_management_events (
      enterprise_id,
      device_identifier,
      power_management_event_data,
      updated_at
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'power_management_event_data')::jsonb,
      (d->>'updated_at')::timestamp with time zone
    from unnest(power_management_events) as d
    on conflict (enterprise_id,device_identifier)
    do update set
      power_management_event_data = excluded.power_management_event_data,
      updated_at = excluded.updated_at;

    -- デバイス履歴の挿入（最後に実行）
    insert into devices_histories (
      enterprise_id,
      device_identifier,
      device_response_data
    )
    select
      (d->>'enterprise_id')::text,
      (d->>'device_identifier')::text,
      (d->>'device_response_data')::jsonb
    from unnest(device_histories) as d;

  exception
    when lock_not_available then
      raise exception 'Lock timeout occurred: Could not acquire necessary locks within 10 seconds';
    when deadlock_detected then
      raise exception 'Deadlock detected: Transaction was chosen as deadlock victim';
    when others then
      raise exception 'Transaction failed: %', SQLERRM;
  end;
end;$function$
;

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

grant delete on table "public"."device_application_reports" to "anon";

grant insert on table "public"."device_application_reports" to "anon";

grant references on table "public"."device_application_reports" to "anon";

grant select on table "public"."device_application_reports" to "anon";

grant trigger on table "public"."device_application_reports" to "anon";

grant truncate on table "public"."device_application_reports" to "anon";

grant update on table "public"."device_application_reports" to "anon";

grant delete on table "public"."device_application_reports" to "authenticated";

grant insert on table "public"."device_application_reports" to "authenticated";

grant references on table "public"."device_application_reports" to "authenticated";

grant select on table "public"."device_application_reports" to "authenticated";

grant trigger on table "public"."device_application_reports" to "authenticated";

grant truncate on table "public"."device_application_reports" to "authenticated";

grant update on table "public"."device_application_reports" to "authenticated";

grant delete on table "public"."device_application_reports" to "service_role";

grant insert on table "public"."device_application_reports" to "service_role";

grant references on table "public"."device_application_reports" to "service_role";

grant select on table "public"."device_application_reports" to "service_role";

grant trigger on table "public"."device_application_reports" to "service_role";

grant truncate on table "public"."device_application_reports" to "service_role";

grant update on table "public"."device_application_reports" to "service_role";

grant delete on table "public"."device_hardware_metrics" to "anon";

grant insert on table "public"."device_hardware_metrics" to "anon";

grant references on table "public"."device_hardware_metrics" to "anon";

grant select on table "public"."device_hardware_metrics" to "anon";

grant trigger on table "public"."device_hardware_metrics" to "anon";

grant truncate on table "public"."device_hardware_metrics" to "anon";

grant update on table "public"."device_hardware_metrics" to "anon";

grant delete on table "public"."device_hardware_metrics" to "authenticated";

grant insert on table "public"."device_hardware_metrics" to "authenticated";

grant references on table "public"."device_hardware_metrics" to "authenticated";

grant select on table "public"."device_hardware_metrics" to "authenticated";

grant trigger on table "public"."device_hardware_metrics" to "authenticated";

grant truncate on table "public"."device_hardware_metrics" to "authenticated";

grant update on table "public"."device_hardware_metrics" to "authenticated";

grant delete on table "public"."device_hardware_metrics" to "service_role";

grant insert on table "public"."device_hardware_metrics" to "service_role";

grant references on table "public"."device_hardware_metrics" to "service_role";

grant select on table "public"."device_hardware_metrics" to "service_role";

grant trigger on table "public"."device_hardware_metrics" to "service_role";

grant truncate on table "public"."device_hardware_metrics" to "service_role";

grant update on table "public"."device_hardware_metrics" to "service_role";

grant delete on table "public"."device_history" to "anon";

grant insert on table "public"."device_history" to "anon";

grant references on table "public"."device_history" to "anon";

grant select on table "public"."device_history" to "anon";

grant trigger on table "public"."device_history" to "anon";

grant truncate on table "public"."device_history" to "anon";

grant update on table "public"."device_history" to "anon";

grant delete on table "public"."device_history" to "authenticated";

grant insert on table "public"."device_history" to "authenticated";

grant references on table "public"."device_history" to "authenticated";

grant select on table "public"."device_history" to "authenticated";

grant trigger on table "public"."device_history" to "authenticated";

grant truncate on table "public"."device_history" to "authenticated";

grant update on table "public"."device_history" to "authenticated";

grant delete on table "public"."device_history" to "service_role";

grant insert on table "public"."device_history" to "service_role";

grant references on table "public"."device_history" to "service_role";

grant select on table "public"."device_history" to "service_role";

grant trigger on table "public"."device_history" to "service_role";

grant truncate on table "public"."device_history" to "service_role";

grant update on table "public"."device_history" to "service_role";

grant delete on table "public"."device_memory_events" to "anon";

grant insert on table "public"."device_memory_events" to "anon";

grant references on table "public"."device_memory_events" to "anon";

grant select on table "public"."device_memory_events" to "anon";

grant trigger on table "public"."device_memory_events" to "anon";

grant truncate on table "public"."device_memory_events" to "anon";

grant update on table "public"."device_memory_events" to "anon";

grant delete on table "public"."device_memory_events" to "authenticated";

grant insert on table "public"."device_memory_events" to "authenticated";

grant references on table "public"."device_memory_events" to "authenticated";

grant select on table "public"."device_memory_events" to "authenticated";

grant trigger on table "public"."device_memory_events" to "authenticated";

grant truncate on table "public"."device_memory_events" to "authenticated";

grant update on table "public"."device_memory_events" to "authenticated";

grant delete on table "public"."device_memory_events" to "service_role";

grant insert on table "public"."device_memory_events" to "service_role";

grant references on table "public"."device_memory_events" to "service_role";

grant select on table "public"."device_memory_events" to "service_role";

grant trigger on table "public"."device_memory_events" to "service_role";

grant truncate on table "public"."device_memory_events" to "service_role";

grant update on table "public"."device_memory_events" to "service_role";

grant delete on table "public"."device_operations" to "anon";

grant insert on table "public"."device_operations" to "anon";

grant references on table "public"."device_operations" to "anon";

grant select on table "public"."device_operations" to "anon";

grant trigger on table "public"."device_operations" to "anon";

grant truncate on table "public"."device_operations" to "anon";

grant update on table "public"."device_operations" to "anon";

grant delete on table "public"."device_operations" to "authenticated";

grant insert on table "public"."device_operations" to "authenticated";

grant references on table "public"."device_operations" to "authenticated";

grant select on table "public"."device_operations" to "authenticated";

grant trigger on table "public"."device_operations" to "authenticated";

grant truncate on table "public"."device_operations" to "authenticated";

grant update on table "public"."device_operations" to "authenticated";

grant delete on table "public"."device_operations" to "service_role";

grant insert on table "public"."device_operations" to "service_role";

grant references on table "public"."device_operations" to "service_role";

grant select on table "public"."device_operations" to "service_role";

grant trigger on table "public"."device_operations" to "service_role";

grant truncate on table "public"."device_operations" to "service_role";

grant update on table "public"."device_operations" to "service_role";

grant delete on table "public"."device_power_events" to "anon";

grant insert on table "public"."device_power_events" to "anon";

grant references on table "public"."device_power_events" to "anon";

grant select on table "public"."device_power_events" to "anon";

grant trigger on table "public"."device_power_events" to "anon";

grant truncate on table "public"."device_power_events" to "anon";

grant update on table "public"."device_power_events" to "anon";

grant delete on table "public"."device_power_events" to "authenticated";

grant insert on table "public"."device_power_events" to "authenticated";

grant references on table "public"."device_power_events" to "authenticated";

grant select on table "public"."device_power_events" to "authenticated";

grant trigger on table "public"."device_power_events" to "authenticated";

grant truncate on table "public"."device_power_events" to "authenticated";

grant update on table "public"."device_power_events" to "authenticated";

grant delete on table "public"."device_power_events" to "service_role";

grant insert on table "public"."device_power_events" to "service_role";

grant references on table "public"."device_power_events" to "service_role";

grant select on table "public"."device_power_events" to "service_role";

grant trigger on table "public"."device_power_events" to "service_role";

grant truncate on table "public"."device_power_events" to "service_role";

grant update on table "public"."device_power_events" to "service_role";

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

grant delete on table "public"."enterprise_history" to "anon";

grant insert on table "public"."enterprise_history" to "anon";

grant references on table "public"."enterprise_history" to "anon";

grant select on table "public"."enterprise_history" to "anon";

grant trigger on table "public"."enterprise_history" to "anon";

grant truncate on table "public"."enterprise_history" to "anon";

grant update on table "public"."enterprise_history" to "anon";

grant delete on table "public"."enterprise_history" to "authenticated";

grant insert on table "public"."enterprise_history" to "authenticated";

grant references on table "public"."enterprise_history" to "authenticated";

grant select on table "public"."enterprise_history" to "authenticated";

grant trigger on table "public"."enterprise_history" to "authenticated";

grant truncate on table "public"."enterprise_history" to "authenticated";

grant update on table "public"."enterprise_history" to "authenticated";

grant delete on table "public"."enterprise_history" to "service_role";

grant insert on table "public"."enterprise_history" to "service_role";

grant references on table "public"."enterprise_history" to "service_role";

grant select on table "public"."enterprise_history" to "service_role";

grant trigger on table "public"."enterprise_history" to "service_role";

grant truncate on table "public"."enterprise_history" to "service_role";

grant update on table "public"."enterprise_history" to "service_role";

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

grant delete on table "public"."policy_history" to "anon";

grant insert on table "public"."policy_history" to "anon";

grant references on table "public"."policy_history" to "anon";

grant select on table "public"."policy_history" to "anon";

grant trigger on table "public"."policy_history" to "anon";

grant truncate on table "public"."policy_history" to "anon";

grant update on table "public"."policy_history" to "anon";

grant delete on table "public"."policy_history" to "authenticated";

grant insert on table "public"."policy_history" to "authenticated";

grant references on table "public"."policy_history" to "authenticated";

grant select on table "public"."policy_history" to "authenticated";

grant trigger on table "public"."policy_history" to "authenticated";

grant truncate on table "public"."policy_history" to "authenticated";

grant update on table "public"."policy_history" to "authenticated";

grant delete on table "public"."policy_history" to "service_role";

grant insert on table "public"."policy_history" to "service_role";

grant references on table "public"."policy_history" to "service_role";

grant select on table "public"."policy_history" to "service_role";

grant trigger on table "public"."policy_history" to "service_role";

grant truncate on table "public"."policy_history" to "service_role";

grant update on table "public"."policy_history" to "service_role";

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

grant delete on table "public"."pubsub_message_logs" to "anon";

grant insert on table "public"."pubsub_message_logs" to "anon";

grant references on table "public"."pubsub_message_logs" to "anon";

grant select on table "public"."pubsub_message_logs" to "anon";

grant trigger on table "public"."pubsub_message_logs" to "anon";

grant truncate on table "public"."pubsub_message_logs" to "anon";

grant update on table "public"."pubsub_message_logs" to "anon";

grant delete on table "public"."pubsub_message_logs" to "authenticated";

grant insert on table "public"."pubsub_message_logs" to "authenticated";

grant references on table "public"."pubsub_message_logs" to "authenticated";

grant select on table "public"."pubsub_message_logs" to "authenticated";

grant trigger on table "public"."pubsub_message_logs" to "authenticated";

grant truncate on table "public"."pubsub_message_logs" to "authenticated";

grant update on table "public"."pubsub_message_logs" to "authenticated";

grant delete on table "public"."pubsub_message_logs" to "service_role";

grant insert on table "public"."pubsub_message_logs" to "service_role";

grant references on table "public"."pubsub_message_logs" to "service_role";

grant select on table "public"."pubsub_message_logs" to "service_role";

grant trigger on table "public"."pubsub_message_logs" to "service_role";

grant truncate on table "public"."pubsub_message_logs" to "service_role";

grant update on table "public"."pubsub_message_logs" to "service_role";

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

grant delete on table "public"."waiting_users" to "anon";

grant insert on table "public"."waiting_users" to "anon";

grant references on table "public"."waiting_users" to "anon";

grant select on table "public"."waiting_users" to "anon";

grant trigger on table "public"."waiting_users" to "anon";

grant truncate on table "public"."waiting_users" to "anon";

grant update on table "public"."waiting_users" to "anon";

grant delete on table "public"."waiting_users" to "authenticated";

grant insert on table "public"."waiting_users" to "authenticated";

grant references on table "public"."waiting_users" to "authenticated";

grant select on table "public"."waiting_users" to "authenticated";

grant trigger on table "public"."waiting_users" to "authenticated";

grant truncate on table "public"."waiting_users" to "authenticated";

grant update on table "public"."waiting_users" to "authenticated";

grant delete on table "public"."waiting_users" to "service_role";

grant insert on table "public"."waiting_users" to "service_role";

grant references on table "public"."waiting_users" to "service_role";

grant select on table "public"."waiting_users" to "service_role";

grant trigger on table "public"."waiting_users" to "service_role";

grant truncate on table "public"."waiting_users" to "service_role";

grant update on table "public"."waiting_users" to "service_role";

grant delete on table "public"."wifi_configurations" to "anon";

grant insert on table "public"."wifi_configurations" to "anon";

grant references on table "public"."wifi_configurations" to "anon";

grant select on table "public"."wifi_configurations" to "anon";

grant trigger on table "public"."wifi_configurations" to "anon";

grant truncate on table "public"."wifi_configurations" to "anon";

grant update on table "public"."wifi_configurations" to "anon";

grant delete on table "public"."wifi_configurations" to "authenticated";

grant insert on table "public"."wifi_configurations" to "authenticated";

grant references on table "public"."wifi_configurations" to "authenticated";

grant select on table "public"."wifi_configurations" to "authenticated";

grant trigger on table "public"."wifi_configurations" to "authenticated";

grant truncate on table "public"."wifi_configurations" to "authenticated";

grant update on table "public"."wifi_configurations" to "authenticated";

grant delete on table "public"."wifi_configurations" to "service_role";

grant insert on table "public"."wifi_configurations" to "service_role";

grant references on table "public"."wifi_configurations" to "service_role";

grant select on table "public"."wifi_configurations" to "service_role";

grant trigger on table "public"."wifi_configurations" to "service_role";

grant truncate on table "public"."wifi_configurations" to "service_role";

grant update on table "public"."wifi_configurations" to "service_role";

create policy "DELETE"
on "public"."apps"
as permissive
for delete
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "INSERT"
on "public"."apps"
as permissive
for insert
to authenticated
with check (has_enterprise_access(enterprise_id));


create policy "SELECT"
on "public"."apps"
as permissive
for select
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "UPDATE"
on "public"."apps"
as permissive
for update
to authenticated
using (has_enterprise_access(enterprise_id))
with check (has_enterprise_access(enterprise_id));


create policy "DELETE"
on "public"."device_application_reports"
as permissive
for delete
to authenticated
using (has_device_access(device_uuid));


create policy "INSERT"
on "public"."device_application_reports"
as permissive
for insert
to authenticated
with check (has_device_access(device_uuid));


create policy "SELECT"
on "public"."device_application_reports"
as permissive
for select
to authenticated
using (has_device_access(device_uuid));


create policy "UPDATE"
on "public"."device_application_reports"
as permissive
for update
to public
using (has_device_access(device_uuid))
with check (has_device_access(device_uuid));


create policy "DELETE"
on "public"."device_hardware_metrics"
as permissive
for delete
to public
using (has_device_access(device_uuid));


create policy "INSERT"
on "public"."device_hardware_metrics"
as permissive
for insert
to authenticated
with check (has_device_access(device_uuid));


create policy "SELECT"
on "public"."device_hardware_metrics"
as permissive
for select
to authenticated
using (has_device_access(device_uuid));


create policy "UPDATE"
on "public"."device_hardware_metrics"
as permissive
for update
to authenticated
using (has_device_access(device_uuid))
with check (has_device_access(device_uuid));


create policy "ALL"
on "public"."device_history"
as permissive
for all
to authenticated
using (has_device_access(device_uuid))
with check (has_device_access(device_uuid));


create policy "ALL"
on "public"."device_memory_events"
as permissive
for all
to authenticated
using (has_device_access(device_uuid))
with check (has_device_access(device_uuid));


create policy "ALL"
on "public"."device_operations"
as permissive
for all
to authenticated
using (has_enterprise_access(enterprise_id))
with check (has_enterprise_access(enterprise_id));


create policy "ALL"
on "public"."device_power_events"
as permissive
for all
to authenticated
using (has_device_access(device_uuid))
with check (has_device_access(device_uuid));


create policy "DELETE"
on "public"."devices"
as permissive
for delete
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "INSERT"
on "public"."devices"
as permissive
for insert
to authenticated
with check (has_enterprise_access(enterprise_id));


create policy "SELECT"
on "public"."devices"
as permissive
for select
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "UPDATE"
on "public"."devices"
as permissive
for update
to authenticated
using (has_enterprise_access(enterprise_id))
with check (has_enterprise_access(enterprise_id));


create policy "DELETE"
on "public"."enterprise_history"
as permissive
for delete
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "Enable insert for authenticated users only"
on "public"."enterprise_history"
as permissive
for insert
to authenticated
with check (true);


create policy "SELECT"
on "public"."enterprise_history"
as permissive
for select
to authenticated
using (true);


create policy "UPDATE"
on "public"."enterprise_history"
as permissive
for update
to authenticated
using (has_enterprise_access(enterprise_id))
with check (has_enterprise_access(enterprise_id));


create policy "DELETE"
on "public"."enterprises"
as permissive
for delete
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "INSERT"
on "public"."enterprises"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = subscription_owner_id));


create policy "SELECT"
on "public"."enterprises"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = subscription_owner_id));


create policy "UPDATE"
on "public"."enterprises"
as permissive
for update
to authenticated
using (has_enterprise_access(enterprise_id))
with check (has_enterprise_access(enterprise_id));


create policy "DELETE"
on "public"."policies"
as permissive
for delete
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "INSERT"
on "public"."policies"
as permissive
for insert
to authenticated
with check (has_enterprise_access(enterprise_id));


create policy "SELECT"
on "public"."policies"
as permissive
for select
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "UPDATE"
on "public"."policies"
as permissive
for update
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "DELETE"
on "public"."policy_history"
as permissive
for delete
to authenticated
using (has_policy_access(policy_id));


create policy "INSERT"
on "public"."policy_history"
as permissive
for insert
to authenticated
with check (has_policy_access(policy_id));


create policy "SELECT"
on "public"."policy_history"
as permissive
for select
to authenticated
using (has_policy_access(policy_id));


create policy "UPDATE"
on "public"."policy_history"
as permissive
for update
to authenticated
using (has_policy_access(policy_id))
with check (has_policy_access(policy_id));


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
using ((( SELECT auth.uid() AS uid) = subscription_owner_id));


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
using (((( SELECT auth.uid() AS uid) = subscription_owner_id) OR can_access_project(project_id)));


create policy "Policy with table joins"
on "public"."projects"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = subscription_owner_id));


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


create policy "Enable read access for all users"
on "public"."service_limits"
as permissive
for select
to authenticated
using (true);


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
with check (has_enterprise_access(enterprise_id));


create policy "SELECT"
on "public"."usage_log_events"
as permissive
for select
to authenticated
using (has_enterprise_access(enterprise_id));


create policy "DELETE"
on "public"."users"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."users"
as permissive
for insert
to authenticated
with check (true);


create policy "SELECT"
on "public"."users"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "UPDATE"
on "public"."users"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Policy with security definer functions"
on "public"."wifi_configurations"
as permissive
for all
to authenticated
using (has_enterprise_access(enterprise_id))
with check (has_enterprise_access(enterprise_id));


CREATE TRIGGER trigger_set_device_display_name_with_fallback BEFORE INSERT ON public.devices FOR EACH ROW EXECUTE FUNCTION set_device_display_name_with_fallback();



