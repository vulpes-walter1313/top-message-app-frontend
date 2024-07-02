import { createLazyFileRoute } from "@tanstack/react-router";
import Button from "../components/Button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="">Welcome to ChattApp</h1>
          <p>A simple chat app made for the odin project exercises.</p>
        </div>
        <div className="flex gap-4">
          <Button href="#" as="link" variant="solid">
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
