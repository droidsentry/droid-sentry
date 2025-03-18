import PasswordUpdateForm from "./form";

export default function Page() {
  return (
    <div className="sm:absolute inset-0 flex place-items-center">
      <div className="m-auto max-w-md  w-full lg:w-2/5 p-4">
        <PasswordUpdateForm />
      </div>
    </div>
  );
}
