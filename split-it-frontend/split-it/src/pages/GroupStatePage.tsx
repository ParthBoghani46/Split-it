/* eslint-disable @typescript-eslint/no-explicit-any */
import { Totals } from "@/components/Totals";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getGroup, getGroupExpenses } from "@/services/Service";
import { getTotalGroupSpending } from "@/lib/totals";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { GroupTabs } from "@/components/GroupTabs";
import { ShareButton } from "@/components/ShareButton";
import { SaveGroupLocally } from "@/components/SaveRecentGroup";
interface GroupStatePageProps {
  groupId: string;
}
let name: string;
const notFound = () => <h1>404 - Not Found</h1>;

const GroupStatePage: React.FC<GroupStatePageProps> = ({ groupId }) => {
  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalGroupSpendings, setTotalGroupSpendings] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch group data
        const groupResponse = await getGroup(groupId);

        if (!groupResponse) {
          // If group not found, handle accordingly
          notFound();
          return;
        }
        name = groupResponse.name;
        setGroup(groupResponse);

        // Fetch group expenses
        const expensesResponse = await getGroupExpenses(groupId);
        setExpenses(expensesResponse);

        // Calculate total group spending
        const totalSpendings = getTotalGroupSpending(expensesResponse);
        setTotalGroupSpendings(totalSpendings);

        // Set loading to false after all data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group data:", error);
        // Handle error
      }
    };

    fetchData();
  }, [groupId]);

  if (loading) {
    return <p>Loading group data...</p>;
  }

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

        <SaveGroupLocally group={{ id: group.id, name: group.name }} />
      </div>

      <Card className="bg-zinc-100 dark:bg-zinc-700 text-card dark:text-white justify-center items-center rounded-lg p-6 mb-4 mt-4 mx-auto max-w-screen-lg w-full">
        <CardHeader>
          <CardTitle className="mb-4 text-2xl">Totals</CardTitle>
          <CardDescription>
            Spending summary of the entire group.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Totals
            group={group}
            expenses={expenses}
            totalGroupSpendings={totalGroupSpendings}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default GroupStatePage;
