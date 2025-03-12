import SignUpForm from "./components/sign-up-form";

export default function Page() {
  return (
    <div className="sm:absolute inset-0 flex place-items-center">
      <div className="m-auto max-w-md lg:w-2/5 p-4 md:mt-28 lg:mt-32">
        <SignUpForm />
      </div>
    </div>
  );
}
