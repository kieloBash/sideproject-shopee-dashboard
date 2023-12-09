import TransactionComponent from "@/components/page/transactions/component";
import MinerProvider from "@/contexts/MinerProvider";
import React from "react";

const TransactionsPage = () => {
  return (
    <>
      <section className="w-full h-screen flex flex-col p-4 bg-white">
        <header className="w-full text-2xl h-10">
          <h1 className="font-bold text-main-default">Miners</h1>
        </header>
        <article className="flex-1 flex flex-col py-2 relative">
          <MinerProvider>
            <TransactionComponent />
          </MinerProvider>
        </article>
      </section>
    </>
  );
};

export default TransactionsPage;
