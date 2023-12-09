import { CardLists } from "@/components/page/dashboard/card/card";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import React from "react";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <section className="w-full h-screen flex flex-col p-4 bg-white">
        <header className="w-full text-2xl h-10">
          <h1 className="font-bold text-main-default">Dashboard</h1>
        </header>
        <article className="flex-1 flex flex-col py-2 relative">
          <CardLists />
        </article>
      </section>
    </>
  );
};

export default DashboardPage;
