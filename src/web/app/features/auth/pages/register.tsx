import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, redirect } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { http } from "~/shared/utils/http";
import { setSession } from "~/shared/utils/session";
import { queryClient } from "~/shared/utils/query-client";
import { userQueryOption } from "../hooks/api/use-user";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export async function clientLoader() {
  try {
    const user = await queryClient.ensureQueryData(userQueryOption);
    if (user) {
      return redirect("/dashboard");
    }
  } catch {
    // Ignore
  }
  return null;
}

export default function Register() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      organizationName: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: any) => {
      const payload: any = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      if (values.organizationName) {
        payload.organizationName = values.organizationName;
      }
      return http.post("auth/register", { json: payload }).json<{ accessToken: string; user: any }>();
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      navigate("/dashboard");
    },
    onError: async (error) => {
      if (error instanceof HTTPError) {
        try {
          const errorData = await error.response.json<any>();
          setErrorMsg(errorData.message || "Registration failed");
        } catch {
          setErrorMsg("Registration failed");
        }
      } else {
        setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred");
      }
    },
  });

  const onSubmit = (values: any) => {
    setErrorMsg(null);
    registerMutation.mutate(values);
  };

  const isSubmitting = registerMutation.isPending;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Enter your details to get started with Flow Forge
                    </p>
                  </div>
                  {errorMsg && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                      {errorMsg}
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="John Doe"
                      {...register("name", { required: "Full name is required" })} />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="m@example.com"
                      {...register("email", {
                        required: "Email address is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })} />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                      })} />
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="organizationName">Organization Name (Optional)</Label>
                      <span className="text-xs text-muted-foreground">Default: [Your Name]'s Org</span>
                    </div>
                    <Input id="organizationName" type="text" placeholder="Acme Corp"
                      {...register("organizationName")} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Sign up"}
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">Login</Link>
                  </div>
                </div>
              </form>
              <div className="bg-muted relative hidden md:block">
                <div className="absolute inset-0 flex flex-col justify-center bg-zinc-900 p-10 text-white dark:bg-zinc-900">
                  <div className="relative z-20 flex items-center text-lg font-medium gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" className="mr-2 h-6 w-6">
                      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3z" />
                    </svg>
                    Flow Forge
                  </div>
                  <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                      <p className="text-lg">
                        &ldquo;Flow Forge has saved us countless hours of manual work by automating our core operations.&rdquo;
                      </p>
                      <footer className="text-sm">Acme Corp Product Team</footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground text-center text-xs [&_a]:hover:text-primary [&_a]:underline [&_a]:underline-offset-4">
            By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
