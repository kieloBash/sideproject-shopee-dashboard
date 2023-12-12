"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ArrowUpDown, CalendarIcon, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import supabase from "@/utils/supabase";

const schema = z.object({
  amount: z.number().gte(0),
  dob: z.date({
    required_error: "A date of expenses is required",
  }),
  description: z.string().max(160).min(4),
  source: z.string({
    required_error: "Please select a source.",
  }),
});

const sources = [
  { label: "Shopee", value: "shopee" },
  { label: "Facebook", value: "facebook" },
  { label: "Others", value: "others" },
] as const;

type FormValues = z.infer<typeof schema>;

export function IncomeForm() {
  const { data: session } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 },
    mode: "onChange",
  });

  async function onSubmit(data: FormValues) {
    if (!session?.user) return null;
    // @ts-ignore
    const user_id = (session?.user?.id as string) || "";

    const newIncome = await supabase
      .from("income")
      .insert({
        user_id,
        date: data.dob,
        source: data.source,
        amount: data.amount,
        description: data.description,
      })
      .select("*")
      .single();

    if (newIncome.error) return null;

    form.reset();
    toast({
      title: "Successfully added income",
      variant: "success",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Php."
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Income</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Special Notes"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Source</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? sources.find((source) => source.value === field.value)
                            ?.label
                        : "Select source"}
                      <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search source..." />
                    <CommandEmpty>No source found.</CommandEmpty>
                    <CommandGroup>
                      {sources.map((source) => (
                        <CommandItem
                          value={source.label}
                          key={source.value}
                          onSelect={() => {
                            form.setValue("source", source.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              source.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {source.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Income</Button>
      </form>
    </Form>
  );
}
