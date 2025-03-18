/*
 * 関数名: has_enterprise_access
 * 説明: 現在ログインしているユーザーが特定のエンタープライズにアクセスできるかどうかを確認します
 * 引数: enterprise_id_param text - アクセス権をチェックするエンタープライズID
 * 戻り値: boolean - アクセス権がある場合はtrue、ない場合はfalse
 *
 * 使用例:
 * 1. 単純なアクセス権チェック:
 *    SELECT has_enterprise_access('enterprise123');
 *
 * 2. 条件分岐での使用:
 *    IF has_enterprise_access(some_enterprise_id) THEN
 *      -- アクセス権のある処理
 *    ELSE
 *      -- アクセス権のない処理
 *    END IF;
 *
 * 3. RLSポリシーでの使用（単一エンタープライズチェック向け）:
 *    CREATE POLICY "enterprise_data_policy" ON public.enterprise_data
 *    FOR SELECT TO authenticated
 *    USING (has_enterprise_access(enterprise_id));
 *
 * 4. サーバーサイド関数でのアクセス権チェック:
 *    CREATE FUNCTION process_enterprise_data(enterprise_id_param text) RETURNS void AS $$
 *    BEGIN
 *      IF NOT has_enterprise_access(enterprise_id_param) THEN
 *        RAISE EXCEPTION 'アクセス権限がありません';
 *      END IF;
 *      -- 処理を続行
 *    END;
 *    $$ LANGUAGE plpgsql;
 *
 * パフォーマンス最適化:
 * - EXISTS句を使用して最初の一致で評価を停止
 * - MATERIALIZED CTEを使用して auth.uid() の呼び出しを最適化
 * - SECURITY DEFINER により関数がRLSを回避して直接テーブルにアクセス
 * - STABLE キーワードでトランザクション内での結果キャッシュを有効化
 */
CREATE OR REPLACE FUNCTION public.has_enterprise_access(enterprise_id_param text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
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
$$;