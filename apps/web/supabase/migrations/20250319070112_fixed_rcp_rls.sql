drop policy "Enable users to view their own data only" on "public"."projects";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_or_upsert_devices_data(devices jsonb[], device_hardware_metrics jsonb[], device_memory_events jsonb[], device_power_events jsonb[], device_application_reports jsonb[], device_history jsonb[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$begin
  -- トランザクション分離レベルとタイムアウトの設定
  set local transaction isolation level read committed;
  set local lock_timeout = '10s';

  begin
    -- デバイスデータの更新（最初に実行）
    CREATE TEMP TABLE updated_devices (id uuid, device_id text);
    
    WITH inserted_devices AS (
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
        (d->>'policy_id')::uuid,
        (d->>'requested_policy_id')::uuid,
        (d->>'device_details')::jsonb,
        (d->>'updated_at')::timestamp with time zone
      from unnest(devices) as d
      on conflict (enterprise_id,device_id)
      do update set
        policy_id = excluded.policy_id,
        requested_policy_id = excluded.requested_policy_id,
        device_details = excluded.device_details,
        updated_at = excluded.updated_at
      RETURNING id, device_id
    )
    INSERT INTO updated_devices
    SELECT id, device_id FROM inserted_devices;
    
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
        (d->>'report_data')::jsonb,
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
end;$function$
;

create policy "Enable read access for all users"
on "public"."projects"
as permissive
for select
to public
using (((( SELECT auth.uid() AS uid) = subscription_owner_id) OR can_access_project(project_id)));




