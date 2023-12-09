"use client";

import { StatusMinerFilterType } from "@/components/page/transactions/component";
import { Miner } from "@/lib/interfaces";
import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

const useFetchMiners = ({
  filter,
  date = new Date(),
}: {
  filter: StatusMinerFilterType;
  date: Date | undefined;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [`miner`, filter, date],
    queryFn: async () => {
      let supabaseQuery = supabase.from("invoice").select("*");

      // Add filter based on StatusMinerFilterType
      if (filter !== "All") {
        supabaseQuery = supabaseQuery.filter("status", "eq", filter);
      }
      // Add filter based on createdAt Date
      supabaseQuery = supabaseQuery.filter(
        "created_at",
        "gte",
        date.toISOString()
      );

      const { data: miners, error } = await supabaseQuery;

      return miners as Miner[];
    },
    enabled: date !== undefined,
  });
  return { data, isLoading };
};

export default useFetchMiners;
