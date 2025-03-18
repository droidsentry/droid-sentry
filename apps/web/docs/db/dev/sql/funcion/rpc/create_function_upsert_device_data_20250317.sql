/*
 * Function: insert_or_upsert_devices_data
 * 
 * デバイスデータの一括更新を行う関数
 *
 * Parameters:
 *   devices - デバイス基本情報の配列（必須）
 *     {
 *       enterprise_id: text,
 *       device_id: text,
 *       policy_id: text,
 *       requested_policy_id: text,
 *       device_details: jsonb,
 *       updated_at: timestamp
 *     }
 *   device_hardware_metrics - ハードウェアメトリクスの配列（オプション）
 *     {
 *       device_id: text,
 *       metrics: jsonb,
 *       measured_at: timestamp
 *     }
 *   device_memory_events - メモリイベントの配列（オプション）
 *     {
 *       device_id: text,
 *       measured_at: timestamp,
 *       event_type: text,
 *       byte_count: bigint
 *     }
 *   device_power_events - 電源イベントの配列（オプション）
 *     {
 *       device_id: text,
 *       measured_at: timestamp,
 *       event_type: text,
 *       battery_level: smallint
 *     }
 *   device_application_reports - アプリケーションレポートの配列（オプション）
 *     {
 *       device_id: text,
 *       application_report_data: jsonb,
 *       updated_at: timestamp
 *     }
 *   device_history - デバイス履歴の配列（必須）
 *     {
 *       device_id: text,
 *       response_details: jsonb
 *     }
 *
 * 処理概要:
 * 1. デバイス基本情報の更新（必須）
 *    - 既存デバイスの場合は更新、新規デバイスの場合は挿入
 * 2. 各種メトリクス・イベントデータの追加（オプション）
 *    - 既存データがある場合はスキップ
 *    - エラーが発生しても処理は継続
 * 3. デバイス履歴の記録（必須）
 *    - エラーが発生した場合は全体をロールバック
 *
 * エラー処理:
 * - オプショナルデータ（metrics, events, reports）のエラーは警告として処理継続
 * - 必須データ（devices, history）のエラーは例外としてロールバック
 * - ロックタイムアウト: 10秒
 * - トランザクション分離レベル: READ COMMITTED
 */
CREATE OR REPLACE FUNCTION public.insert_or_upsert_devices_data(
  devices jsonb[],
  device_hardware_metrics jsonb[],
  device_memory_events jsonb[],
  device_power_events jsonb[],
  device_application_reports jsonb[],
  device_history jsonb[]
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
    WITH updated_devices AS (
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
      RETURNING id, device_id
    )
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
    from unnest(device_histories) as d
    JOIN updated_devices ud ON ud.device_id = (d->>'device_id')::text;

      -- 処理成功のログ
      raise notice 'Successfully processed device data for % devices', (select count(*) from unnest(devices));
    exception
      when others then
        raise exception 'Failed to insert device history data: %', SQLERRM;  -- 重要なデータなのでexceptionとする
   end;

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