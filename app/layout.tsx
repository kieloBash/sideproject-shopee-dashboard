import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
// import AuthProvider from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
  title: "LizBoutique - Shopee",
  description: "Generated by bb Kielo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <main className="flex flex-col w-full min-h-screen bg-slate-50">
          <Toaster />
          {/* <AuthProvider> */}
          <QueryProvider>{children}</QueryProvider>
          {/* </AuthProvider> */}
        </main>
      </body>
    </html>
  );
}
