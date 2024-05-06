/* eslint-disable @typescript-eslint/no-explicit-any */
// Importing components
import { ExpenseForm } from "@/components/ExpenseForm";
import Navbar from "@/components/Navbar";
import { GroupTabs } from "@/components/GroupTabs";

// Importing services
import {
  deleteExpense,
  getExpense,
  getGroup,
  updateExpense,
} from "@/services/Service";

// Importing schema
import { expenseFormSchema } from "@/lib/schemas";

// Importing React utilities
import { Suspense, useEffect, useState } from "react";

// Importing Link component from react-router-dom
import { Link } from "react-router-dom";

// Importing a component for 404 page
const notFound = () => <h1>404 - Not Found</h1>;

let name: string;

function EditExpensePage({
  params: { groupId, expenseId },
}: {
  params: { groupId: string; expenseId: string };
}) {
  const [group, setGroup] = useState<any>(null);
  const [expense, setExpense] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedGroup = await getGroup(groupId);
        if (!fetchedGroup) {
          notFound();
          return;
        }
        const fetchedExpense = await getExpense(groupId, expenseId);
        if (!fetchedExpense) {
          notFound();
          return;
        }
        name = fetchedGroup.name;
        setGroup(fetchedGroup);
        setExpense(fetchedExpense);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [groupId, expenseId]);

  async function updateExpenseAction(values: unknown) {
    "use server";
    const expenseFormValues = expenseFormSchema.parse(values);
    await updateExpense(groupId, expenseId, expenseFormValues);
    window.location.href = `/groups/${groupId}`;
  }

  async function deleteExpenseAction() {
    "use server";
    await deleteExpense(expenseId, groupId);
    window.location.href = `/groups/${groupId}`;
  }

  return (
    <Suspense>
      <div className="w-full min-h-screen bg-midnight-800 dark:bg-zinc-800 text-card dark:text-white">
        <Navbar />
        <div>
          <div className="flex flex-row mx-auto  pt-32 justify-between px-6 rounded-lg gap-3 pb-2 max-w-screen-lg w-full">
            <h1 className="font-semibold text-3xl">
              <Link to={`/groups/${groupId}`}>{name}</Link>
            </h1>

            <div className="flex gap-2 justify-between">
              <GroupTabs groupId={groupId} />
            </div>
          </div>
        </div>
        <ExpenseForm
          group={group}
          expense={expense}
          onSubmit={updateExpenseAction}
          onDelete={deleteExpenseAction}
        />
      </div>
    </Suspense>
  );
}
export default EditExpensePage;
