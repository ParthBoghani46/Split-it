/* eslint-disable @typescript-eslint/no-explicit-any */
// Importing components
import { BalancesList } from "@/components/BalancesList";
import { ReimbursementList } from "@/components/ReimbursementList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { GroupTabs } from "@/components/GroupTabs";
import { ShareButton } from "@/components/ShareButton";

// Importing services
import { getGroup, getGroupExpenses } from "@/services/Service";
import {
  getBalances,
  getPublicBalances,
  getSuggestedReimbursements,
} from "@/lib/balances";

// Importing React utilities
import { useEffect, useState } from "react";

// Importing Link component from react-router-dom
import { Link } from "react-router-dom";

type Group = /*unresolved*/ any;
let name: string;
const GroupBalancesPage: React.FC<{ params: { groupId: string } }> = ({
  params: { groupId },
}) => {
  const [group, setGroup] = useState<Group | null>(null); // Assuming Group is the type of your group object

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedGroup = await getGroup(groupId);
        name = fetchedGroup.name;
        setGroup(fetchedGroup);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchData();
  }, [groupId]);

  // Now group is guaranteed to be non-null
  const [expenses, setExpenses] = useState<null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const fetchedExpenses = await getGroupExpenses(groupId);
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Error fetching expenses data:", error);
      }
    };
    fetchExpenses();
  }, [groupId]);

  // Render loading state if expenses is null
  if (!expenses) {
    return <div>Loading expenses...</div>;
  }

  const balances = getBalances(expenses);
  const reimbursements = getSuggestedReimbursements(balances);
  const publicBalances = getPublicBalances(reimbursements);

  return (
    <div className="w-full min-h-screen bg-midnight-800 dark:bg-zinc-800 text-card dark:text-white">
      <Navbar />
      <div>
        <div className="flex flex-row mx-auto  pt-32 justify-between px-6 rounded-lg gap-3 pb-3 max-w-screen-lg w-full">
          <h1 className="font-semibold text-3xl">
            <Link to={`/groups/${groupId}`}>{name}</Link>
          </h1>

          <div className="flex gap-2 justify-between">
            <GroupTabs groupId={groupId} />

            <ShareButton group={group} />
          </div>
        </div>
      </div>
      <Card className="bg-zinc-100 dark:bg-zinc-700 text-card dark:text-white justify-center items-center rounded-lg p-6 mb-4 mt-4 mx-auto max-w-screen-lg w-full">
        <CardHeader>
          <CardTitle className="text-3xl mb-2">Balances</CardTitle>
          <CardDescription className="mb-4">
            This is the amount that each participant paid or was paid for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BalancesList
            balances={publicBalances}
            participants={group.participants}
            currency={group.currency}
          />
        </CardContent>
      </Card>
      <Card className="bg-zinc-100 dark:bg-zinc-700 justify-center items-center rounded-lg p-6 mb-4 mt-4 mx-auto max-w-screen-lg w-full">
        <CardHeader>
          <CardTitle className="text-3xl mb-2">
            Suggested reimbursements
          </CardTitle>
          <CardDescription className="mb-4">
            Here are suggestions for optimized reimbursements between
            participants.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ReimbursementList
            reimbursements={reimbursements}
            participants={group.participants}
            currency={group.currency}
            groupId={groupId}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default GroupBalancesPage;
