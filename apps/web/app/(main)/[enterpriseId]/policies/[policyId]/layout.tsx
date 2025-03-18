import PolicyToolBar from "../components/policy-tool-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <PolicyToolBar />
      </div>
      <div className="flex-1 min-h-0 min-w-0">{children}</div>
    </div>
  );
}
