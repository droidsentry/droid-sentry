export const dynamic = "force-dynamic";

import CreateProjectForm from "./form";

export default function Page() {
  return (
    <div className="lg:absolute inset-0 flex place-items-center p-4">
      <div className="mx-auto">
        <CreateProjectForm
          title="新規プロジェクト作成"
          description="新しいプロジェクトの詳細を入力してください"
          submitButtonText="プロジェクトを作成"
        />
      </div>
    </div>
  );
}
