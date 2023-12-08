import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) redirect("/dashboard");
  else redirect("/auth/sign-in");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
