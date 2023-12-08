import SignOutButton from "@/components/global/SignOutButton";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import React from "react";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <div>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
