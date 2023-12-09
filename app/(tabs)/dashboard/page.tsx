import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import React from "react";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <section className="w-full h-screen flex flex-col justify-center items-center">
        Coming Soon...
      </section>
    </>
  );
};

export default DashboardPage;
