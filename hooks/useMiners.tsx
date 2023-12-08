"use client";

import { Miner } from "@/lib/interfaces";
import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

const useFetchMiners = () => {
  const { data, isLoading } = useQuery({
    queryKey: [`miner`],
    queryFn: async () => {
      const { data: miners, error } = await supabase
        .from("invoice")
        .select("*");

      return miners as Miner[];
    },
  });
  return { data, isLoading };
};

export default useFetchMiners;
