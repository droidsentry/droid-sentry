import PasswordResetVerifyForm from "./password-reset-verify-form";

export default function Page() {
  return (
    <div className="sm:absolute inset-0 flex place-items-center">
      <div className="m-auto max-w-md lg:w-2/5 p-4">
        <PasswordResetVerifyForm />
      </div>
    </div>
  );
}
