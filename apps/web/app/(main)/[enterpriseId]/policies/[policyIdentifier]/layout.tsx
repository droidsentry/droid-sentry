import PolicyToolBar from "../components/policy-tool-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <PolicyToolBar />
      <div className="flex-1 min-h-0 p-2">{children}</div>
    </div>
  );
}
