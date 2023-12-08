import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthFormLogin } from "./user-auth-form";

export const metadata: Metadata = {
  title: "LizBoutique - Shopee | Authentication",
  description: "Authentication for LizBoutique",
};

export default function SignInPage() {
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/auth/sign-up"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Register
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-main-default" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            LizBoutique
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This dashboard is for invoicing and viewing the sales of
                miners curated and designed for LizBoutique&rdquo;
              </p>
              <footer className="text-sm">Kielo Mercado</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Hello.</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password to login.
              </p>
            </div>
            <UserAuthFormLogin />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      <div className="lg:hidden flex min-h-screen flex-col">
        <section className="w-full min-h-screen bg-white flex flex-col justify-center items-center relative">
          <div className="absolute top-4 left-4">
            <div className="z-20 flex items-center text-lg font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              LizBoutique
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Link
              href="/auth/sign-up"
              className={cn(buttonVariants({ variant: "ghost" }), "")}
            >
              Register
            </Link>
          </div>
          <div className="p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Hello.
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email and password to login.
                </p>
              </div>
              <UserAuthFormLogin />
            </div>
          </div>
        </section>
        <section className="w-full h-screen bg-main-default"></section>
      </div>
    </>
  );
}