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

export function ViewMinersModal() {
  const { toggleView, setToggleView, setSelectedMiner, selectedMiner } =
    useMinerContext();
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
              <h4 className="mb-4 text-sm font-medium leading-none">Items</h4>
              {selectedMiner?.cart.map((tag) => (
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
                      >
                        <PenBox />
                      </Button>
                      <Button
                        type="button"
                        variant={"ghostBtn"}
                        className="w-4 h-4 p-0"
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
