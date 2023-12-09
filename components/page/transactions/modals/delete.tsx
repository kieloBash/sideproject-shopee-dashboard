"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMinerContext } from "@/contexts/MinerProvider";
import supabase from "@/utils/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function DeleteMinerModal() {
  const { selectedMiner, setSelectedMiner, toggleDelete, setToggleDelete } =
    useMinerContext();

  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  async function deleteMiner() {
    if (selectedMiner === undefined) return null;
    setIsLoading(true);

    const res = await supabase
      .from("invoice")
      .delete()
      .eq("id", selectedMiner.id);

    if (res.error) {
      console.log(res);
      setIsLoading(false);
    } else {
      setToggleDelete(false);
      setSelectedMiner(undefined);
      setIsLoading(false);

      queryClient.invalidateQueries({
        queryKey: [`miners`],
      });
      queryClient.invalidateQueries({
        queryKey: [`miner-dates`],
      });
    }
  }
  return (
    <AlertDialog open={toggleDelete} onOpenChange={setToggleDelete}>
      <AlertDialogContent className="max-w-[320px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete miner{" "}
            <span className="font-bold underline underline-offset-2">
              {selectedMiner?.miner_name || ""}
            </span>{" "}
            and cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            onClick={() => {
              setSelectedMiner(undefined);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button disabled={isLoading} onClick={deleteMiner}>
            Continue{" "}
            {isLoading && <Loader2 className="w-5 h-5 animate-spin ml-2" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
