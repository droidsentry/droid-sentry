CREATE OR REPLACE FUNCTION public.insert_or_upsert_devices_data(
  devices jsonb[],
  application_reports jsonb[],
  memory_events jsonb[],
  power_management_events jsonb[],
  device_histories jsonb[],
  device_displays jsonb[],
  device_hardware_status jsonb[],
  device_metrics jsonb[]
)
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