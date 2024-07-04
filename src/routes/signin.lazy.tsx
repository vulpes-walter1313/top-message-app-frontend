import { createLazyFileRoute } from "@tanstack/react-router";
import SigninForm from "../components/SigninForm";

export const Route = createLazyFileRoute("/signin")({
  component: SigninPage,
});

function SigninPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-11/12 max-w-lg flex-col gap-8 rounded-lg border border-zinc-950/15 bg-white p-6 shadow-md">
        <div>
          <h1 className="pb-2">Sign In</h1>
          <p className="text-mobsmp font-light text-zinc-600 lg:text-desksmp">
            Sign In to continue
          </p>
        </div>
        <SigninForm />
      </div>
    </main>
  );
}
