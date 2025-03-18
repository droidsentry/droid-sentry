create or replace function upsert_device_data(
  devices jsonb[],
  application_reports jsonb[],
  memory_events jsonb[],
  power_management_events jsonb[],
  device_histories jsonb[]
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  -- トランザクション開始
  begin
    -- デバイスデータの更新
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

    -- アプリケーションレポートの更新
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

    -- メモリイベントの更新
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

    -- 電源管理イベントの更新
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

    -- デバイス履歴の挿入
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
    when others then
      -- エラーが発生した場合はロールバック
      raise exception 'Transaction failed: %', SQLERRM;
  end;
end;
$$;