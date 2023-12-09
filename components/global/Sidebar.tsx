"use client";
import { useSidebar } from "@/contexts/SidebarProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { SidebarClose, SidebarIcon } from "lucide-react";

const Sidebar = () => {
  const LINKS = [
    { href: "/dashboard", label: "Home" },
    { href: "/transactions", label: "Miners" },
    { href: "/promo", label: "Promo" },
  ];
  const pathname = usePathname();
  const { toggle, setToggle } = useSidebar();

  if (!toggle)
    return (
      <>
        <Button
          type="button"
          onClick={() => setToggle(true)}
          variant={"ghostBtn"}
          size={"btn"}
          className="fixed top-4 right-4 text-main-default"
        >
          <SidebarIcon className="w-full h-full" />
        </Button>
      </>
    );
  return (
    <>
      <section className="lg:hidden fixed inset-0 z-[110] bg-main-default text-white flex justify-center items-center">
        <Button
          type="button"
          onClick={() => setToggle(false)}
          variant={"ghostBtn"}
          size={"btn"}
          className="absolute top-4 right-4 text-white hover:text-slate-200"
        >
          <SidebarClose className="w-full h-full" />
        </Button>
        <ul className="w-full flex flex-col justify-center items-center">
          {LINKS.map((link) => {
            const isActive =
              (pathname.includes(link.href) && link.href.length > 1) ||
              pathname === link.href;

            const activeClass = isActive
              ? "bg-white text-main-default font-bold uppercase"
              : "text-white";

            return (
              <Link
                href={link.href}
                key={link.label}
                className="w-full max-w-xs"
                onClick={() => setToggle(false)}
              >
                <li className={`${activeClass} text-2xl py-2 text-center`}>
                  {link.label}
                </li>
              </Link>
            );
          })}
        </ul>
      </section>

      <section className="fixed top-0 right-0 hidden w-48 p-4 h-screen z-[110] bg-main-default text-white lg:flex justify-center items-start pt-20">
        <Button
          type="button"
          onClick={() => setToggle(false)}
          variant={"ghostBtn"}
          size={"btn"}
          className="absolute top-4 left-4 text-white hover:text-slate-200 rotate-180"
        >
          <SidebarClose className="w-full h-full" />
        </Button>
        <ul className="w-full flex flex-col justify-center items-center">
          {LINKS.map((link) => {
            const isActive =
              (pathname.includes(link.href) && link.href.length > 1) ||
              pathname === link.href;

            const activeClass = isActive
              ? "bg-white text-main-default font-bold uppercase"
              : "text-white";

            return (
              <Link
                href={link.href}
                key={link.label}
                className="w-full max-w-xs"
                onClick={() => setToggle(false)}
              >
                <li className={`${activeClass} text-2xl py-2 text-center`}>
                  {link.label}
                </li>
              </Link>
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default Sidebar;
