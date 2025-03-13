import WaitingForm from "./components/waiting-form";

export default function Page() {
  return (
    <div className="sm:absolute inset-0 flex place-items-center">
      <div className="m-auto max-w-lg p-4 md:mt-20">
        <WaitingForm />
      </div>
    </div>
  );
}
