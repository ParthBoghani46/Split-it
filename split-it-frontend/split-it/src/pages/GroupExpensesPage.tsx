/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
// Importing UI components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Importing icon
import { Plus } from "lucide-react";

// Importing React utilities
import { Suspense, useEffect, useState } from "react";

// Importing components
import Expenses from "@/components/Expenses";
import Navbar from "@/components/Navbar";
import { GroupTabs } from "@/components/GroupTabs";

// Importing services
import { getGroup } from "@/services/Service";

// Importing components for sharing and saving group
import { ShareButton } from "@/components/ShareButton";
import { SaveGroupLocally } from "@/components/SaveRecentGroup";

// Importing Link component from react-router-dom
import { Link } from "react-router-dom";

// Importing a component for 404 page
const notFound = () => <h1>404 - Not Found</h1>;

// Exporting revalidation time
export const revalidate = 3600;

let name: string;

interface Group {
  id: string;
  name: string;
}
const GroupExpensesPage: React.FC<{ params: { groupId: string } }> = ({
  params: { groupId },
}) => {
  const [group, setGroup] = useState<Group>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedGroup = await getGroup(groupId);
        name = fetchedGroup.name;
        setGroup(fetchedGroup);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [groupId]);
  if (!group) {
    return notFound();
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
      <Card className="dark:bg-zinc-700 bg-zinc-100 justify-center items-center rounded-lg p-6 mb-4 mt-4 mx-auto max-w-screen-lg w-full">
        <div className="flex flex-1">
          <CardHeader className="flex-1 p-4 sm:p-6">
            <CardTitle className=" mb-4 text-3xl">Expenses</CardTitle>
            <CardDescription>
              Here are the expenses that you created for your group.
            </CardDescription>
          </CardHeader>
          <CardHeader className="p-4 sm:p-6 flex flex-row space-y-0 gap-2">
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/60 h-10 w-10 items-center justify-center flex rounded-lg"
            >
              <Link to={`/groups/${groupId}/expenses/create`}>
                <Plus className="w-5 h-5 " />
              </Link>
            </Button>
          </CardHeader>
        </div>

        <CardContent className="p-0 pt-2 pb-4 sm:pb-6 flex flex-col gap-4 relative">
          <Suspense
            fallback={[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border-t flex justify-between items-center px-6 py-4 text-sm"
              >
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-32 rounded-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
              </div>
            ))}
          >
            <Expenses groupId={groupId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupExpensesPage;
