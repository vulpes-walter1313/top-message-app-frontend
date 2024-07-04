import { createLazyFileRoute } from "@tanstack/react-router";
import RegisterForm from "../components/RegisterForm";

export const Route = createLazyFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-11/12 max-w-lg flex-col gap-8 rounded-lg border border-zinc-950/15 bg-white p-6 shadow-md">
        <div>
          <h1 className="pb-2">Register</h1>
          <p className="text-mobsmp font-light text-zinc-600 lg:text-desksmp">
            Register to continue
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
