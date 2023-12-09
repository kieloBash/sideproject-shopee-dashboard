"use client";

import { Miner } from "@/lib/interfaces";
import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

const useFetchMinersSearch = ({ searchName }: { searchName: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: [`miners-search`, searchName],
    queryFn: async () => {
      if (!searchName) {
        // Return an empty array if searchName is not provided
        return [];
      }

      let supabaseQuery = supabase.from("invoice").select("*");

      // Use ilike for case-insensitive search
      supabaseQuery = supabaseQuery.filter(
        "miner_name",
        "ilike",
        `%${searchName}%`
      );

      const { data: miners, error } = await supabaseQuery;

      return miners as Miner[];
    },
    enabled: searchName !== "",
  });

  return { data, isLoading };
};

export default useFetchMinersSearch;
