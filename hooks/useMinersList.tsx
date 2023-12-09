"use client";

import { StatusMinerFilterType } from "@/components/page/transactions/component";
import { Miner } from "@/lib/interfaces";
import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

const useFetchMinersList = ({
  date = new Date(),
}: {
  date: Date | undefined;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [`miners`, date],
    queryFn: async () => {
      let supabaseQuery = supabase.from("invoice").select("*");

      // Filter for timestamps on the specified date (UTC)
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

      supabaseQuery = supabaseQuery
        .filter("created_at", "gte", startDate.toISOString())
        .filter("created_at", "lte", endDate.toISOString());

      const { data: miners, error } = await supabaseQuery;

      return miners as Miner[];
    },
    enabled: date !== undefined,
  });
  return { data, isLoading };
};

export default useFetchMinersList;
