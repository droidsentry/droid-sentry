import SignUpForm from "./sign-up-form";

export default function Page() {
  return (
    <div className="sm:absolute inset-0 flex place-items-center">
      <div className="m-auto max-w-md lg:w-2/5 p-4 md:mt-28">
        <SignUpForm />
      </div>
    </div>
  );
}
