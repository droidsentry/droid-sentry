import {
  OnChangeFn,
  Updater,
  Table,
  RowData,
  TableFeature,
  makeStateUpdater,
  functionalUpdate,
} from "@tanstack/react-table";

// 新しい機能のカスタム状態のタイプを定義
// 行の密度の状態
type DensityState = "sm" | "md" | "lg" | "xl";
interface DensityTableState {
  density: DensityState;
}

// 新しい機能のテーブル オプションのタイプ
interface DensityOptions {
  enableDensity?: boolean; // 行の密度を有効にするかどうか
  onDensityChange?: OnChangeFn<DensityState>; // 行の密度が変更されたときの処理
}

// 新しい機能のテーブル API のタイプを定義
// interface DensityInstance {
//   setDensity: (updater: Updater<DensityState>) => void; // 行の密度を設定する
//   toggleDensity: (value?: DensityState) => void; // 行の密度を切り替える
// }

// 宣言マージを使用して、新しい機能 API と状態タイプを TanStack テーブルの既存のタイプに追加
declare module "@tanstack/react-table" {
  // 新しい機能の状態を既存のテーブルの状態とマージ
  // interface TableState extends DensityTableState {}
  interface TableState {
    density: DensityState;
  }
  // 新しい機能のオプションを既存のテーブルのオプションとマージ
  // interface TableOptionsResolved<TData> extends DensityOptions {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableOptionsResolved<TData extends RowData> {
    enableDensity?: boolean;
    onDensityChange?: OnChangeFn<DensityState>;
  }

  // 新しい機能のインスタンス API を既存のテーブル インスタンス API とマージ
  // interface Table<TData> extends DensityInstance {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Table<TData extends RowData> {
    setDensity: (updater: Updater<DensityState>) => void;
    toggleDensity: (value?: DensityState) => void;
  }

  // セル インスタンス API を追加する必要がある場合...
  // インターフェイス Cell<TData extends RowData, TValue> extends DensityCell

  // 行インスタンス API を追加する必要がある場合...
  // インターフェース Row<TData extends RowData> extends DensityRow

  // 列インスタンス API を追加する必要がある場合...
  // インターフェイス Column<TData extends RowData, TValue> extends DensityColumn

  // ヘッダー インスタンス API を追加する必要がある場合...
  // インターフェース Header<TData extends RowData, TValue> extends DensityHeader

  // 注: `ColumnDef` はインターフェイスではなく型であるため、宣言をマージすることはできません。
  // ただし、`ColumnDef.meta` で宣言のマージを使用することはできます。
}

export const DensityFeature: TableFeature = {
  // 新しい機能の初期状態を定義
  getInitialState: (state): DensityTableState => ({
    density: "md",
    ...state,
  }),

  // 新しい機能のデフォルト オプションを定義
  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): DensityOptions => ({
    enableDensity: true,
    onDensityChange: makeStateUpdater("density", table), // 行の密度が変更されたときの処理

    // onDensityChange: (updater) =>
    //   table.options.onStateChange?.((old) => ({
    //     ...old,
    //     density: typeof updater === "function" ? updater(old.density) : updater,
    //   })),
  }),

  // カラムのデフォルト定義を追加する必要がある場合...
  // getDefaultColumnDef: <TData extends RowData>(): Partial<ColumnDef<TData>> => {
  // return { meta: {} }; // カラム定義に直接追加するのではなく、meta を使用して型スクリプトの問題を回避する
  // },

  // 新しい機能のテーブル インスタンス メソッドを定義
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    // 2. setDensityの内部
    table.setDensity = (updater) => {
      // setDensityの型 type Updater<T> = T | ((old: T) => T)
      //「新しい値そのもの」または「古い値を受け取って新しい値を返す関数」のどちらかを受け付ける
      // functionalUpdateが実行される時に
      // 現在のdensityの値がoldとして渡される
      const safeUpdater: Updater<DensityState> = (old) => {
        const newState = functionalUpdate(updater, old);
        return newState;
      };
      // 3. 最終的にonDensityChange（つまりsetDensity）が呼ばれる
      return table.options.onDensityChange?.(safeUpdater);
    };

    //1. toggleDensityが呼ばれる
    table.toggleDensity = (value) => {
      // この時点では、oldはまだ存在しない

      // 4. setDensityの内部が実行される
      // setDensityが呼ばれる時、Reactは現在のdensityの値を
      // 更新関数に自動的に渡す
      table.setDensity((currentDensity) => {
        // ここの関数は後で実行される
        // currentDensityには現在のdensityの値が入っている
        if (value) return value;

        // 現在のdensityの値を基に次のdensityの値を返す
        return currentDensity === "xl"
          ? "lg"
          : currentDensity === "lg"
          ? "md"
          : currentDensity === "md"
          ? "sm"
          : "xl";
      });
    };
  },
  // 行インスタンス API を追加する必要がある場合...
  // createRow: <TData extends RowData>(row, table): void => {},

  // セル インスタンス API を追加する必要がある場合...
  // createCell: <TData extends RowData>(cell, column, row, table): void => {},

  // 列インスタンス API を追加する必要がある場合...
  // createColumn: <TData extends RowData>(column, table): void => {},

  // ヘッダー インスタンス API を追加する必要がある場合...
  // createHeader: <TData extends RowData>(header, table): void => {},
};
