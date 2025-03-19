import GoogleSignUpCard from "./google-sign-up-card";

export default function Page() {
  return (
    <div className="lg:absolute inset-0 flex place-items-center p-4">
      <div className="mx-auto">
        <GoogleSignUpCard />
      </div>
    </div>
  );
}
