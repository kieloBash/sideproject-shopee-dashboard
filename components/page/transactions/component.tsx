"use client";
import useFetchMiners from "@/hooks/useMiners";
import React, { useEffect, useState } from "react";

// UI
import { MinerCard } from "./cards/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useUniqueDates from "@/hooks/useUniqueDates";
import dayjs from "dayjs";
import { useMinerContext } from "@/contexts/MinerProvider";
import { ViewMinersModal } from "./modals/view";
import { DeleteMinerModal } from "./modals/delete";
import { AddMinerModal } from "./modals/add";
import { EditMinerModal } from "./modals/edit";

export type StatusMinerFilterType = "All" | "Pending" | "Confirmed";
const TransactionComponent = () => {
  const [filter, setFilter] = useState<StatusMinerFilterType>("All");
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const { selectedMiner } = useMinerContext();

  const miners = useFetchMiners({ filter, date });
  const uniqueDates = useUniqueDates();

  // useEffect(() => {
  //   if (uniqueDates.data.length > 0) {
  //     const lastIndex = uniqueDates.data
  //       .slice()
  //       .reverse()
  //       .findIndex((item) => true);
  //     const lastItem =
  //       uniqueDates.data[uniqueDates.data.length - 1 - lastIndex];

  //     // Assuming lastItem is a string in the format 'YYYY-MM-DD', convert it to a Date object
  //     const dateObject = new Date(lastItem);

  //     // Update the state with the new date
  //     setDate(dateObject);
  //   }
  // }, [uniqueDates.data]);

  return (
    <>
      {selectedMiner && <ViewMinersModal />}
      {selectedMiner && <DeleteMinerModal />}
      {selectedMiner && <EditMinerModal />}
      <AddMinerModal />
      <div className="w-full flex gap-2 justify-start items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
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
        <Select
          value={filter}
          onValueChange={(e) => setFilter(e as StatusMinerFilterType)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select a filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter</SelectLabel>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {miners.isLoading ? (
        <div className="flex flex-col gap-1.5 py-2">
          {Array(3)
            .fill([])
            .map((_, index) => {
              return (
                <Skeleton
                  key={index}
                  className="w-full rounded-lg h-36"
                ></Skeleton>
              );
            })}
        </div>
      ) : (
        <>
          {miners.data && miners.data.length > 0 ? (
            <>
              <ScrollArea className="px-2 w-full h-[calc(100vh-9.6rem)] mt-2">
                <div className="w-full py-2 h-full flex flex-col gap-1.5">
                  {miners?.data?.map((miner) => {
                    return <MinerCard miner={miner} key={miner.id} />;
                  })}
                </div>
              </ScrollArea>
              <div className="w-full flex justify-end items-center mt-2">
                <span className="text-sm text-foreground">
                  {miners.data.length} results
                </span>
              </div>
            </>
          ) : (
            <div className="text-center mt-4 w-full h-full justify-center items-center">
              <span className="">No Results Found</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TransactionComponent;
