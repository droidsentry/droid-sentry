drop policy "Enable delete for users based on user_id" on "public"."memory_events";

drop policy "Enable insert for authenticated users only" on "public"."memory_events";

drop policy "Enable read access for all users" on "public"."memory_events";

drop policy "Enable update for users based on email" on "public"."memory_events";

drop policy "Enable delete for users based on user_id" on "public"."power_management_events";

drop policy "Enable insert for authenticated users only" on "public"."power_management_events";

drop policy "Enable read access for all users" on "public"."power_management_events";

drop policy "Enable update for users based on email" on "public"."power_management_events";

drop policy "Enable users to view their own data only" on "public"."devices";

drop function if exists "public"."upsert_device_data"(devices jsonb[], application_reports jsonb[], memory_events jsonb[], power_management_events jsonb[], device_histories jsonb[]);

alter table "public"."memory_events" drop constraint "memory_events_pkey";

alter table "public"."power_management_events" drop constraint "power_management_events_pkey";

drop index if exists "public"."memory_events_pkey";

drop index if exists "public"."power_management_events_pkey";

create table "public"."device_displays" (
    "enterprise_id" text not null,
    "device_identifier" text not null,
    "last_status_report_time" timestamp with time zone not null,
    "displays" jsonb[] not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."device_displays" enable row level security;

create table "public"."device_hardware_status" (
    "enterprise_id" text not null,
    "device_identifier" text not null,
    "create_time" timestamp with time zone not null,
    "hardware_status" jsonb not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."device_hardware_status" enable row level security;

create table "public"."device_metrics" (
    "enterprise_id" text not null,
    "device_identifier" text not null,
    "create_time" timestamp with time zone not null,
    "battery_temperatures" double precision[],
    "cpu_temperatures" double precision[],
    "gpu_temperatures" double precision[],
    "skin_temperatures" double precision[],
    "cpu_usages" double precision[],
    "fan_speeds" double precision[],
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."device_metrics" enable row level security;

alter table "public"."devices" add column "requested_policy_identifier" text;

alter table "public"."memory_events" drop column "memory_event_data";

alter table "public"."memory_events" drop column "updated_at";

alter table "public"."memory_events" add column "byte_count" bigint;

alter table "public"."memory_events" add column "create_time" timestamp with time zone not null;

alter table "public"."memory_events" add column "event_type" text not null;

alter table "public"."power_management_events" drop column "created_at";

alter table "public"."power_management_events" drop column "power_management_event_data";

alter table "public"."power_management_events" drop column "updated_at";

alter table "public"."power_management_events" add column "battery_level" smallint;

alter table "public"."power_management_events" add column "create_time" timestamp with time zone not null;

alter table "public"."power_management_events" add column "event_type" text not null;

CREATE UNIQUE INDEX device_displays_pkey ON public.device_displays USING btree (enterprise_id, device_identifier, last_status_report_time);

CREATE UNIQUE INDEX device_hardware_status_pkey ON public.device_hardware_status USING btree (enterprise_id, device_identifier, create_time);

CREATE UNIQUE INDEX device_metrics_pkey ON public.device_metrics USING btree (enterprise_id, device_identifier, create_time);

CREATE UNIQUE INDEX memory_events_pkey ON public.memory_events USING btree (enterprise_id, device_identifier, create_time);

CREATE UNIQUE INDEX power_management_events_pkey ON public.power_management_events USING btree (enterprise_id, device_identifier, create_time);

alter table "public"."device_displays" add constraint "device_displays_pkey" PRIMARY KEY using index "device_displays_pkey";

alter table "public"."device_hardware_status" add constraint "device_hardware_status_pkey" PRIMARY KEY using index "device_hardware_status_pkey";

alter table "public"."device_metrics" add constraint "device_metrics_pkey" PRIMARY KEY using index "device_metrics_pkey";

alter table "public"."memory_events" add constraint "memory_events_pkey" PRIMARY KEY using index "memory_events_pkey";

alter table "public"."power_management_events" add constraint "power_management_events_pkey" PRIMARY KEY using index "power_management_events_pkey";

alter table "public"."device_displays" add constraint "device_displays_enterprise_id_device_identifier_fkey" FOREIGN KEY (enterprise_id, device_identifier) REFERENCES devices(enterprise_id, device_identifier) ON DELETE CASCADE not valid;

alter table "public"."device_displays" validate constraint "device_displays_enterprise_id_device_identifier_fkey";

alter table "public"."device_hardware_status" add constraint "device_hardware_status_device_fkey" FOREIGN KEY (enterprise_id, device_identifier) REFERENCES devices(enterprise_id, device_identifier) ON DELETE CASCADE not valid;

alter table "public"."device_hardware_status" validate constraint "device_hardware_status_device_fkey";

alter table "public"."device_metrics" add constraint "device_metrics_device_fkey" FOREIGN KEY (enterprise_id, device_identifier) REFERENCES devices(enterprise_id, device_identifier) ON DELETE CASCADE not valid;

alter table "public"."device_metrics" validate constraint "device_metrics_device_fkey";

alter table "public"."devices" add constraint "devices_enterprise_id_requested_policy_identifier_fkey" FOREIGN KEY (enterprise_id, requested_policy_identifier) REFERENCES policies(enterprise_id, policy_identifier) ON DELETE SET NULL not valid;

alter table "public"."devices" validate constraint "devices_enterprise_id_requested_policy_identifier_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_or_upsert_devices_data(devices jsonb[], application_reports jsonb[], memory_events jsonb[], power_management_events jsonb[], device_histories jsonb[], device_displays jsonb[], device_hardware_status jsonb[], device_metrics jsonb[])
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
end;
$function$
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

grant delete on table "public"."device_displays" to "anon";

grant insert on table "public"."device_displays" to "anon";

grant references on table "public"."device_displays" to "anon";

grant select on table "public"."device_displays" to "anon";

grant trigger on table "public"."device_displays" to "anon";

grant truncate on table "public"."device_displays" to "anon";

grant update on table "public"."device_displays" to "anon";

grant delete on table "public"."device_displays" to "authenticated";

grant insert on table "public"."device_displays" to "authenticated";

grant references on table "public"."device_displays" to "authenticated";

grant select on table "public"."device_displays" to "authenticated";

grant trigger on table "public"."device_displays" to "authenticated";

grant truncate on table "public"."device_displays" to "authenticated";

grant update on table "public"."device_displays" to "authenticated";

grant delete on table "public"."device_displays" to "service_role";

grant insert on table "public"."device_displays" to "service_role";

grant references on table "public"."device_displays" to "service_role";

grant select on table "public"."device_displays" to "service_role";

grant trigger on table "public"."device_displays" to "service_role";

grant truncate on table "public"."device_displays" to "service_role";

grant update on table "public"."device_displays" to "service_role";

grant delete on table "public"."device_hardware_status" to "anon";

grant insert on table "public"."device_hardware_status" to "anon";

grant references on table "public"."device_hardware_status" to "anon";

grant select on table "public"."device_hardware_status" to "anon";

grant trigger on table "public"."device_hardware_status" to "anon";

grant truncate on table "public"."device_hardware_status" to "anon";

grant update on table "public"."device_hardware_status" to "anon";

grant delete on table "public"."device_hardware_status" to "authenticated";

grant insert on table "public"."device_hardware_status" to "authenticated";

grant references on table "public"."device_hardware_status" to "authenticated";

grant select on table "public"."device_hardware_status" to "authenticated";

grant trigger on table "public"."device_hardware_status" to "authenticated";

grant truncate on table "public"."device_hardware_status" to "authenticated";

grant update on table "public"."device_hardware_status" to "authenticated";

grant delete on table "public"."device_hardware_status" to "service_role";

grant insert on table "public"."device_hardware_status" to "service_role";

grant references on table "public"."device_hardware_status" to "service_role";

grant select on table "public"."device_hardware_status" to "service_role";

grant trigger on table "public"."device_hardware_status" to "service_role";

grant truncate on table "public"."device_hardware_status" to "service_role";

grant update on table "public"."device_hardware_status" to "service_role";

grant delete on table "public"."device_metrics" to "anon";

grant insert on table "public"."device_metrics" to "anon";

grant references on table "public"."device_metrics" to "anon";

grant select on table "public"."device_metrics" to "anon";

grant trigger on table "public"."device_metrics" to "anon";

grant truncate on table "public"."device_metrics" to "anon";

grant update on table "public"."device_metrics" to "anon";

grant delete on table "public"."device_metrics" to "authenticated";

grant insert on table "public"."device_metrics" to "authenticated";

grant references on table "public"."device_metrics" to "authenticated";

grant select on table "public"."device_metrics" to "authenticated";

grant trigger on table "public"."device_metrics" to "authenticated";

grant truncate on table "public"."device_metrics" to "authenticated";

grant update on table "public"."device_metrics" to "authenticated";

grant delete on table "public"."device_metrics" to "service_role";

grant insert on table "public"."device_metrics" to "service_role";

grant references on table "public"."device_metrics" to "service_role";

grant select on table "public"."device_metrics" to "service_role";

grant trigger on table "public"."device_metrics" to "service_role";

grant truncate on table "public"."device_metrics" to "service_role";

grant update on table "public"."device_metrics" to "service_role";

create policy "INSERT"
on "public"."device_displays"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "SELECT"
on "public"."device_displays"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "INSERT"
on "public"."device_hardware_status"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "SELECT"
on "public"."device_hardware_status"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Policy with security definer functions"
on "public"."device_metrics"
as permissive
for all
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "INSERT"
on "public"."memory_events"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "SELECT"
on "public"."memory_events"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "INSERT"
on "public"."power_management_events"
as permissive
for insert
to authenticated
with check (can_access_enterprise(enterprise_id));


create policy "SELECT"
on "public"."power_management_events"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));


create policy "Enable users to view their own data only"
on "public"."devices"
as permissive
for select
to authenticated
using (can_access_enterprise(enterprise_id));




