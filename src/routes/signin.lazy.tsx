import { createLazyFileRoute } from "@tanstack/react-router";
import SigninForm from "../components/SigninForm";

export const Route = createLazyFileRoute("/signin")({
  component: SigninPage,
});

function SigninPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-lg border border-zinc-950/15 w-11/12 rounded-lg shadow-md bg-white p-6 flex flex-col gap-8">
        <div>
          <h1 className="pb-2">Sign In</h1>
          <p className="text-mobsmp lg:text-desksmp font-light text-zinc-600">
            Sign In to continue
          </p>
        </div>
        <SigninForm />
      </div>
    </main>
  );
}
