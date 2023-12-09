"use client";
import React, { useMemo, useState } from "react";

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
import { Loader2, Minus, Plus, Trash } from "lucide-react";
import supabase from "@/utils/supabase";
import { Miner } from "@/lib/interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ViewMinersModal() {
  const { toggleView, setToggleView, setSelectedMiner, selectedMiner } =
    useMinerContext();

  const [free, setFree] = useState(selectedMiner?.free || 0);
  const [cart, setCart] = useState<number[]>(selectedMiner?.cart || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  async function updateMiner(minerToUpdate: Miner) {
    setIsLoading(true);
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
      setToggleView(false);
      setSelectedMiner(undefined);
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!selectedMiner) return null;
    const newMiner = { ...selectedMiner, cart, free };
    await updateMiner(newMiner as Miner);
  }

  function handleDeleteItem(index: number) {
    if (!selectedMiner) return null;
    if (selectedMiner?.cart.length <= 1) return null;

    const updatedCart = [...selectedMiner.cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  }

  const noChanges = useMemo(() => {
    // Check if arrays have the same length
    if (cart.length !== selectedMiner?.cart.length) {
      return false;
    }

    if (free !== selectedMiner?.free) return false;

    // Check if every element in cart exists in selectedMiner?.cart
    return cart.every((element) => selectedMiner?.cart.includes(element));
  }, [cart, free]);

  function getTotalOfCart() {
    if (!selectedMiner) return null;
    const total = cart.reduce((acc, item) => acc + item, 0);
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
        <div className="w-full flex justify-center items-center flex-col gap-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="free" className="text-right">
              Free
            </Label>
            <Input
              id="free"
              value={free}
              onChange={(e) => setFree(Number(e.target.value))}
              type="number"
              className="col-span-1"
            />
            <div className="flex gap-1.5 col-span-2">
              <Button
                disabled={isLoading}
                className="w-10 h-10 p-1"
                onClick={() => setFree((prev) => prev + 1)}
              >
                <Plus />
              </Button>
              <Button
                disabled={free < 1 || isLoading}
                className="w-10 h-10 p-1"
                onClick={() => setFree((prev) => prev - 1)}
              >
                <Minus />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-40 w-48 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Items ({cart.length}) Php {getTotalOfCart()?.toLocaleString()}
              </h4>
              {cart.map((tag, index) => (
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
            disabled={noChanges || isLoading}
            type="button"
            onClick={handleSave}
          >
            Save Changes{" "}
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
