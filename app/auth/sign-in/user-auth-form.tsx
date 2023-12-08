"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import useFetchMiners from "@/hooks/useMiners";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthFormLogin({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  const miners = useFetchMiners();
  
  if (miners.isLoading)
    return (
      <div className="fixed inset-0 z-[100] flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  return (
    <>
      <ul className="max-h-[10rem] overflow-y-auto">
        {miners?.data?.map((miner) => {
          return (
            <li className="" key={miner.id}>
              {miner.miner_name}
            </li>
          );
        })}
      </ul>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="password">
                password
              </Label>
              <Input
                id="password"
                placeholder="password"
                type="password"
                disabled={isLoading}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
