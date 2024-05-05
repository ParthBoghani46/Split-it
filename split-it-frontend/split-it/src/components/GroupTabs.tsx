/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  groupId: string;
};

export function GroupTabs({ groupId }: Props) {
  let value = window.location.pathname;
  // eslint-disable-next-line no-useless-escape
  value = value.replace(/\/groups\/[^\/]+\/([^/]+).*/, "$1") || "expenses";

  return (
    <Tabs
      className="text-lg"
      value={value}
      onValueChange={(value: any) => {
        window.location.href = `/groups/${groupId}/${value}`;
      }}
    >
      <TabsList className="bg-zinc-100 dark:bg-zinc-700 dark:text-white text-card p-2 h-12">
        <TabsTrigger
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-600"
          value="expenses"
        >
          Expenses
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-600"
          value="balances"
        >
          Balances
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-600"
          value="stats"
        >
          Stats
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-600"
          value="analysis"
        >
          Analysis
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-600"
          value="edit"
        >
          Settings
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
