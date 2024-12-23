import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { getBackendUrl } from "../lib/utils";

const SigninFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(40),
});
type Inputs = {
  email: string;
  password: string;
};

export default function SigninForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SigninFormSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const jsonBody = JSON.stringify(data);
    const rawRes = await fetch(`${getBackendUrl()}/signin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonBody,
    });
    const res = await rawRes.json();
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate({ to: "/dashboard" });
    } else {
      alert("sign in failed. please try again");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-950">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="email@example.com"
          className="rounded-md border border-zinc-950/15 px-3 py-2 text-mobp lg:text-deskp"
        />
        {errors.email ? <ErrorMessage message={errors.email.message} /> : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-zinc-950">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          placeholder="********"
          className="rounded-md border border-zinc-950/15 px-3 py-2 text-mobp lg:text-deskp"
        />
        {errors.password ? (
          <ErrorMessage message={errors.password.message} />
        ) : null}
      </div>
      <Button as="submit" variant="solid">
        Sign In
      </Button>
    </form>
  );
}
