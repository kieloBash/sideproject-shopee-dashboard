"use client";

// UI
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  BadgeCheck,
  Calendar,
  CalendarCheck,
  Check,
  ChevronDownIcon,
  CircleIcon,
  MinusCircle,
  PenBox,
  ShoppingBag,
} from "lucide-react";

// BACKEND
import { Miner } from "@/lib/interfaces";
import dayjs from "dayjs";

export function MinerCard({ miner }: { miner: Miner }) {
  return (
    <Card>
      <CardHeader className="grid grid-cols-3 items-start gap-4 space-y-0">
        <div className="space-y-1 col-span-1">
          <CardTitle>{miner.miner_name}</CardTitle>
          <CardDescription>
            <div className="flex items-center">
              <ShoppingBag className="mr-1 h-3 w-3" />
              {miner.cart.length} items
            </div>
            <div className="flex items-center">
              <BadgeCheck className="mr-1 h-3 w-3" />
              {miner.free} free
            </div>
          </CardDescription>
        </div>
        <div className="col-span-2 flex justify-end items-center">
          <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
            <Button
              variant="secondary"
              className={`${
                miner.status === "Confirmed" && "text-main-default"
              } px-2 shadow-none`}
            >
              <Check className={`mr-2 h-4 w-4`} />
              Mined
            </Button>
            <Separator orientation="vertical" className="h-[20px]" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-2 shadow-none">
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                alignOffset={-5}
                className="w-[200px]"
                forceMount
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PenBox className="mr-2 h-4 w-4" /> Edit Miner
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShoppingBag className="mr-2 h-4 w-4" /> View Cart
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MinusCircle className="mr-2 h-4 w-4" /> Delete Miner
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon
              className={`mr-1 h-3 w-3 ${
                miner.status === "Confirmed"
                  ? "fill-green-400 text-green-400"
                  : "fill-yellow-400 text-yellow-400"
              }`}
            />
            {miner.status}
          </div>
          <div className="flex col-span-2 gap-6">
            <div className="flex justify-start items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="">
                {dayjs(new Date(miner.created_at)).format("MMM DD")}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarCheck className="mr-1 h-3 w-3" />
              <span className="">
                {miner.confirm_date
                  ? dayjs(new Date(miner.confirm_date)).format("MMM DD")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
