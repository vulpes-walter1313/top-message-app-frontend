import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "../components/Button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-center">Welcome to ChattApp</h1>
          <p className="text-center">
            A simple chat app made for the odin project exercises.
          </p>
        </div>
        <div className="flex gap-4">
          <Button href="/signin" as="link" variant="solid">
            Sign In
          </Button>
          <Button href="/register" as="link" variant="outline">
            Join
          </Button>
        </div>
      </div>
    </main>
  );
}
