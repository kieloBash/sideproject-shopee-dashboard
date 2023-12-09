"use client";

// UI
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import useFetchMinersList from "@/hooks/useMinersList";
import { Copy, Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Miner } from "@/lib/interfaces";
import { useToast } from "@/components/ui/use-toast";

export function ListMinerModal({ date }: { date: Date | undefined }) {
  const list = useFetchMinersList({ date });
  const { toast } = useToast();

  type CombinedMiner = {
    totalPrice: number;
    totalItems: number;
    totalFree: number;
    miner_name: string;
    created_at: Date;
    totalCart: number[];
  };

  const combinedMiners: CombinedMiner[] = (list?.data || [])
    .filter((miner) => miner.status === "Confirmed") // Filter miners with status "Confirmed"
    .reduce((accumulator: CombinedMiner[], currentMiner: Miner) => {
      const existingMinerIndex = accumulator.findIndex(
        (miner) => miner.miner_name === currentMiner.miner_name
      );

      if (existingMinerIndex !== -1) {
        // Update existing combined miner
        accumulator[existingMinerIndex].totalPrice += currentMiner.cart.reduce(
          (sum, value) => sum + value,
          0
        );
        accumulator[existingMinerIndex].totalItems += currentMiner.cart.length;
        accumulator[existingMinerIndex].totalFree += currentMiner.free;
        accumulator[existingMinerIndex].totalCart = accumulator[
          existingMinerIndex
        ].totalCart.concat(currentMiner.cart);
      } else {
        // Add new combined miner
        const newCombinedMiner: CombinedMiner = {
          totalPrice: currentMiner.cart.reduce((sum, value) => sum + value, 0),
          totalItems: currentMiner.cart.length,
          totalFree: currentMiner.free,
          miner_name: currentMiner.miner_name,
          created_at: currentMiner.created_at,
          totalCart: currentMiner.cart.slice(), // Clone the array
        };
        accumulator.push(newCombinedMiner);
      }

      return accumulator;
    }, []);

  const handleCopyClick = async (data: CombinedMiner) => {
    try {
      let total = 0;
      let tempDate = new Date(data.created_at);
      data.totalCart.forEach((item) => (total += item));

      let link = "";

      if (data.totalCart.length >= 5 && data.totalCart.length <= 8) {
        link =
          "https://shopee.ph/product/465440520/20517586187?utm_campaign=-&utm_content=----&utm_medium=affiliates&utm_source=an_13000970014&utm_term=9r9avpf8rk4o";
      } else if (data.totalCart.length > 8) {
        link =
          "https://shopee.ph/product/465440520/22571943292?utm_campaign=-&utm_content=----&utm_medium=affiliates&utm_source=an_13000970014&utm_term=9r9ayu3bb82j";
      }
      const textToCopy = `Miner: ${data.miner_name} (${
        data.totalCart.length
      } Items) | (${data.totalFree} Free)\nItems: ${data.totalCart.join(
        " + "
      )}\nTotal: ₱${total}\nDate Mined: ${tempDate.toDateString()}
      \n${link}

      `;

      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error("Failed to copy text:", error);
    } finally {
      toast({
        description: `Copied Successfully`,
        variant: "success",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed z-[10] left-1/2 -translate-x-1/2 bottom-4 w-12 h-12 shadow p-2 rounded-full ml-8">
          <Menu className="w-full h-full" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Confirmed Miners List</DialogTitle>
          <DialogDescription>Here are the list of miners that are confirmed</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 w-full rounded-md border">
          <div className="p-4">
            {combinedMiners.map((miner, index) => (
              <>
                <div
                  key={miner.miner_name}
                  className="grid grid-cols-6 text-xs"
                >
                  <div className="line-clamp-1 flex justify-start col-span-2 items-center">
                    {miner.miner_name}
                  </div>
                  <div className="flex justify-start items-center col-span-2 font-medium">
                    ₱ {miner.totalPrice.toLocaleString()}({miner.totalItems})
                  </div>
                  <div className="flex justify-center items-center">
                    {miner.totalFree}
                  </div>
                  <div className="flex justify-center items-center">
                    <Button
                      type="button"
                      variant={"ghostBtn"}
                      className="w-5 h-5 p-0"
                      onClick={() => handleCopyClick(miner)}
                    >
                      <Copy className="w-full h-full" />
                    </Button>
                  </div>
                </div>
                <Separator className="my-2" />
              </>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
