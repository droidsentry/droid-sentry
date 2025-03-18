/*
 * 関数名: get_accessible_enterprises
 * 説明: 現在ログインしているユーザーがアクセス可能なすべてのエンタープライズIDのリストを返します
 *
 * 使用例:
 * 1. RLSポリシーでの使用:
 *    CREATE POLICY "apps_select_policy" ON public.apps
 *    FOR SELECT TO authenticated
 *    USING (enterprise_id IN (SELECT * FROM public.get_accessible_enterprises()));
 *
 * 2. エンタープライズ一覧の取得:
 *    SELECT e.* 
 *    FROM enterprises e
 *    WHERE e.enterprise_id IN (SELECT * FROM public.get_accessible_enterprises());
 *
 * 3. アクセス可能なすべてのエンタープライズに対する集計:
 *    SELECT enterprise_id, COUNT(*) 
 *    FROM some_table
 *    WHERE enterprise_id IN (SELECT * FROM public.get_accessible_enterprises())
 *    GROUP BY enterprise_id;
 *
 * パフォーマンス最適化:
 * - MATERIALIZED CTEを使用して auth.uid() の呼び出しを最適化
 * - SECURITY DEFINER により関数がRLSを回避して直接テーブルにアクセス
 * - STABLE キーワードでトランザクション内での結果キャッシュを有効化
 */
CREATE OR REPLACE FUNCTION public.get_accessible_enterprises()
RETURNS SETOF text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
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
$$;