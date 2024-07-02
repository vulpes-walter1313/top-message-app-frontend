import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "@tanstack/react-router";

const RegisterFormSchema = z
  .object({
    name: z.string().min(3).max(40),
    email: z.string().email(),
    password: z.string().min(8).max(40),
    confirmPassword: z.string().min(8).max(40),
  })
  .refine((data) => data.password === data.confirmPassword);
type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(RegisterFormSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const jsonBody = JSON.stringify(data);
    const rawRes = await fetch("http://localhost:3000/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonBody,
    });
    const res = await rawRes.json();
    console.log(res);
    if (res.success) {
      navigate({ to: "/" });
    } else {
      alert("Registration failed. please try again");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-zinc-950">
          Name
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="Name"
          className="border border-zinc-950/15 text-mobp lg:text-deskp rounded-md py-2 px-3"
        />
        {errors.name ? <ErrorMessage message={errors.name.message} /> : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-950">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="email@example.com"
          className="border border-zinc-950/15 text-mobp lg:text-deskp rounded-md py-2 px-3"
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
          className="border border-zinc-950/15 text-mobp lg:text-deskp rounded-md py-2 px-3"
        />
        {errors.password ? (
          <ErrorMessage message={errors.password.message} />
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-zinc-950">
          Confirm Password
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="********"
          className="border border-zinc-950/15 text-mobp lg:text-deskp rounded-md py-2 px-3"
        />
        {errors.confirmPassword ? (
          <ErrorMessage message={errors.confirmPassword.message} />
        ) : null}
      </div>
      <Button as="button" variant="solid">
        Register
      </Button>
    </form>
  );
}
