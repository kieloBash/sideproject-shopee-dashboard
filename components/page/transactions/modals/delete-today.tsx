"use client";

// UI
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarDays, Calendar as CalendarIcon, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import useUniqueDates from "@/hooks/useUniqueDates";
import { useState } from "react";
import supabase from "@/utils/supabase";
import { useQueryClient } from "@tanstack/react-query";

export function DeleteTodayModal() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const uniqueDates = useUniqueDates();
  const queryClient = useQueryClient();

  async function deleteDate() {
    try {
      if (date === undefined) return null;

      const startDate = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0,
          0
        )
      );
      const endDate = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
          999
        )
      );

      let { data: error } = await supabase
        .from("invoice")
        .delete()
        .filter("created_at", "gte", startDate.toISOString())
        .filter("created_at", "lte", endDate.toISOString());

      if (error) return;
      else {
        queryClient.invalidateQueries({
          queryKey: [`miners`],
        });
        queryClient.invalidateQueries({
          queryKey: [`miner-dates`],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline"><CalendarDays className="w-4 h-4 mr-2"/>Delete Day</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[350px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete all the records of miners for the date, {""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={
                (date) => {
                  return (
                    !uniqueDates.data.includes(
                      dayjs(date).format("YYYY-MM-DD")
                    ) || date > new Date()
                  );
                }
                // date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={date === undefined} onClick={deleteDate}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
