"use client";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "./ui/label";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  isRegisterPage?: boolean;
}

type FormData = z.infer<typeof userAuthSchema>;

export const UserAuthForm = ({
  className,
  isRegisterPage = false,
  ...props
}: UserAuthFormProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false);
  const redirectUrl = useMemo(
    () => searchParams?.get("from") || "/conversations",
    [searchParams]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true);

    if (isRegisterPage) {
      axios
        .post("/api/register", data)
        .then(() =>
          signIn("credentials", {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast({ title: "Invalid credentials!", variant: "destructive" });
          }

          if (callback?.ok && !callback?.error) {
            toast({
              title: "Registration successful.",
              description: "Your account has been successfully registered.",
            });
            router.push(redirectUrl);
          }
        })
        .catch(() =>
          toast({
            title: "Something went wrong.",
            description: "Your register request failed. Please try again.",
            variant: "destructive",
          })
        )
        .finally(() => setIsLoading(false));
    }

    if (!isRegisterPage) {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast({
              title: "Something went wrong.",
              description: "Your sign in request failed. Please try again.",
              variant: "destructive",
            });
          }

          if (callback?.ok && !callback?.error) {
            toast({
              title: "Successfully logged in",
              description: "Welcome back!",
            });
            router.push(redirectUrl);
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: "github" | "google") => {
    if (action === "github") {
      setIsGithubLoading(true);
      setIsGoogleLoading(false);
    } else {
      setIsGithubLoading(false);
      setIsGoogleLoading(true);
    }

    setIsLoading(true);

    signIn(action, {
      redirect: false,
      callbackUrl: redirectUrl,
    })
      .then((callback) => {
        if (callback?.error) {
          toast({
            description: "Invalid credentials",
            variant: "destructive",
          });
        }

        if (callback?.ok && !callback?.error) {
          toast({
            title: "Successfully logged in",
            description: "Welcome back!",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsGoogleLoading(false);
        setIsGithubLoading(false);
      });
  };

  return (
    <div
      className={cn("mt-8 sm:mx-auto sm:w-full sm:max-w-md", className)}
      {...props}
    >
      <div className="bg-background px-4 py-8 shadow dark:bg-[#1c2029] sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {isRegisterPage && (
            <div>
              <Label htmlFor="name" className={cn("text-muted-foreground")}>
                Name
              </Label>
              <Input
                type="text"
                disabled={isLoading}
                {...register("name", { required: true })}
                id="name"
                name="name"
                className={cn(errors["name"] && "focus:ring-rose-500")}
              />
              {errors?.name && (
                <p className="px-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="email" className={cn("text-muted-foreground")}>
              Email address
            </Label>
            <Input
              autoCorrect="off"
              autoCapitalize="none"
              autoComplete="email"
              disabled={isLoading}
              {...register("email", { required: true })}
              id="email"
              type="email"
              name="email"
              className={cn(errors["email"] && "focus:ring-rose-500")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className={cn("text-muted-foreground")}>
              Password
            </Label>
            <Input
              disabled={isLoading}
              {...register("password", { required: true })}
              id="password"
              type="password"
              name="password"
              className={cn(errors["password"] && "focus:ring-rose-500")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            aria-label={isRegisterPage ? "Register" : "Sign in"}
            className={buttonVariants({
              variant: "main",
              className: "w-full text-white",
            })}
          >
            {isLoading && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {isRegisterPage ? "Register" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-muted px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className: "w-full text-muted-foreground",
                })
              )}
              onClick={() => {
                socialAction("github");
              }}
              disabled={isLoading || isGithubLoading}
            >
              {isGithubLoading ? (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" aria-hidden="true" />
              )}{" "}
              Github
            </button>
            <button
              type="button"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className: "w-full text-muted-foreground",
                })
              )}
              onClick={() => {
                socialAction("google");
              }}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" aria-hidden="true" />
              )}{" "}
              Google
            </button>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-2 px-2 text-sm text-gray-500">
          <p>
            {isRegisterPage ? "Already have an account?" : "New to Messenger?"}
          </p>
          <Link
            href={isRegisterPage ? "/login" : "/register"}
            aria-label={
              isRegisterPage ? "Go to login page" : "Go to Create account page"
            }
            className={cn(buttonVariants({ variant: "link", size: "none" }))}
          >
            {isRegisterPage ? "Login" : "Create an account"}
          </Link>
        </div>
      </div>
    </div>
  );
};
