import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./sidebar-nav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Income",
    href: "/finance/income",
  },
  {
    title: "Expense",
    href: "/finance/expense",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <section className="w-full h-screen flex flex-col p-4 bg-white">
        <div className="block space-y-6">
          <div className="space-y-0.5">
            <h2 className="text-2xl text-main-default font-bold tracking-tight">
              Finance
            </h2>
            <p className="text-muted-foreground">
              Manage your income and expenses to record your financials.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="px-4 flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <article className="flex-1 flex flex-col relative">
              {children}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
