"use client";
import React from "react";

// UI
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useMinerContext } from "@/contexts/MinerProvider";
import { PenBox, Trash } from "lucide-react";
import supabase from "@/utils/supabase";
import { Miner } from "@/lib/interfaces";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function ViewMinersModal() {
  const { toggleView, setToggleView, setSelectedMiner, selectedMiner } =
    useMinerContext();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function updateMiner(minerToUpdate: Miner) {
    const res = await supabase
      .from("invoice")
      .update({
        ...minerToUpdate,
        ["cart"]: minerToUpdate.cart,
        ["miner_name"]: minerToUpdate.miner_name,
        ["free"]: minerToUpdate.free,
      })
      .eq("id", minerToUpdate.id);

    if (res.error) console.log(res);
    else {
      queryClient.invalidateQueries({
        queryKey: [`miners`],
      });
      queryClient.invalidateQueries({
        queryKey: [`miner-dates`],
      });
      setSelectedMiner(minerToUpdate);
      // toast({
      //   title: "Successfully Inserted",
      //   description: `Mined: ${minerToUpdate.cart.length}`,
      //   variant: "success",
      // });
    }
  }

  async function handleDeleteItem(index: number) {
    if (!selectedMiner) return null;
    if (selectedMiner?.cart.length <= 1) return null;

    const updatedCart = [...selectedMiner.cart];
    updatedCart.splice(index, 1);
    const newMiner: Miner = { ...selectedMiner, cart: updatedCart as number[] };

    await updateMiner(newMiner);
  }

  function getTotalOfCart() {
    if (!selectedMiner) return null;
    const total = selectedMiner.cart.reduce((acc, item) => acc + item, 0);
    return total;
  }
  return (
    <Dialog
      open={toggleView}
      onOpenChange={(e) => {
        setToggleView(e);
        setSelectedMiner(undefined);
      }}
    >
      <DialogContent className="max-w-[320px] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Miner Cart</DialogTitle>
          <DialogDescription>Here is the cart for the miner</DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-center items-center">
          <ScrollArea className="h-40 w-48 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Items ({selectedMiner?.cart.length}) Php{" "}
                {getTotalOfCart()?.toLocaleString()}
              </h4>
              {selectedMiner?.cart.map((tag, index) => (
                <>
                  <div
                    key={tag}
                    className="text-sm flex justify-between items-center"
                  >
                    <span>{tag}</span>
                    <div className="flex gap-2 justify-center items-center">
                      <Button
                        type="button"
                        variant={"ghostBtn"}
                        className="w-4 h-4 p-0"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              setToggleView(false);
              setSelectedMiner(undefined);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
