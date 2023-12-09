"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// FORM
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import supabase from "@/utils/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const formSchema = z.object({
  miner_name: z.string().min(1, {
    message: "Miner Name must be at least 1 characters.",
  }),
  free: z.number().gte(0),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

export function AddMinerModal() {
  const [cart, setCart] = useState<number[]>([]);
  const [item, setItem] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      miner_name: "",
      free: 0,
      dob: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (cart.length === 0) return null;

    const { miner_name, free, dob } = values;
    const created_at = new Date(
      dob.getFullYear(),
      dob.getMonth(),
      dob.getDate() + 1
    );
    console.log(created_at.toString());
    setIsLoading(true);

    const res = await supabase
      .from("invoice")
      .insert({ miner_name, free, cart, created_at })
      .select("*")
      .single();

    if (res.error) {
      console.log(res.error);
      setIsLoading(false);
    } else {
      queryClient.invalidateQueries({
        queryKey: [`miners`],
      });
      queryClient.invalidateQueries({
        queryKey: [`miner-dates`],
      });
      toast({
        title: "Successfully Inserted",
        description: `Mined: ${cart.length}`,
        variant: "success",
      });
      form.reset();
      setCart([]);
      setItem(0);
      setOpen(false);
      setIsLoading(false);
    }
  }
  function handleDeleteItem(index: number) {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  }
  function getTotalOfCart() {
    const total = cart.reduce((acc, item) => acc + item, 0);
    return total;
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="fixed z-[10] left-1/2 -translate-x-1/2 bottom-4 w-12 h-12 shadow p-1 rounded-full">
            <Plus className="w-full h-full" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-w-[320px]">
          <DialogHeader>
            <DialogTitle>Add Miner</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="miner_name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Name of Miner"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="free"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <FormLabel>Free</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of Free Items"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Mined Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="col-span-1 flex flex-col gap-1.5">
                  <div className="flex flex-col p-2 border rounded-md gap-1">
                    <Label htmlFor="cart">Price</Label>
                    <input
                      type="number"
                      id="cart"
                      placeholder="Price"
                      className="outline-none border-b pl-2 py-1"
                      value={item}
                      onChange={(e) => setItem(Number(e.target.value))}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setCart((prev) => [item, ...prev]);
                      setItem(0);
                    }}
                    className="mt-2"
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="w-full col-span-2 flex justify-center items-center">
                  <ScrollArea className="h-40 w-48 rounded-md border">
                    <div className="p-4">
                      <h4 className="mb-4 text-sm font-medium leading-none">
                        Cart ({cart.length}) Php{" "}
                        {getTotalOfCart().toLocaleString()}
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
                                onClick={() => handleDeleteItem(index)}
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
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full mt-4"
              >
                Submit{" "}
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
