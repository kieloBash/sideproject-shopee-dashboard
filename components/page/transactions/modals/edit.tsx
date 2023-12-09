"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMinerContext } from "@/contexts/MinerProvider";
import { Miner } from "@/lib/interfaces";
import supabase from "@/utils/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export function EditMinerModal() {
  const { toggleEdit, setToggleEdit, setSelectedMiner, selectedMiner } =
    useMinerContext();

  const [name, setName] = useState<string>(selectedMiner?.miner_name || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const noChanges = useMemo(() => {
    if (name !== selectedMiner?.miner_name) return false;

    return true;
  }, [name]);

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
      setToggleEdit(false);
      setSelectedMiner(undefined);
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!selectedMiner) return null;
    const newMiner: Miner = { ...selectedMiner, miner_name: name };
    await updateMiner(newMiner);
  }

  return (
    <Dialog
      open={toggleEdit}
      onOpenChange={(e) => {
        setToggleEdit(e);
        setSelectedMiner(undefined);
      }}
    >
      <DialogContent className="max-w-[320px] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Miner</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={noChanges || isLoading}
            type="button"
            onClick={handleSave}
          >
            Save Changes{" "}
            {isLoading && <Loader2 className="w-5 h-5 animate-spin ml-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
