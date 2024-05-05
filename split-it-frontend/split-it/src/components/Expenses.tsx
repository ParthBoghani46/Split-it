/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getGroup, getGroupExpenses } from "@/services/Service";
import { ExpenseList } from "./ExpenseList";

const notFound = () => <h1>404 - Not Found</h1>;
const Expenses = ({ groupId }: { groupId: string }) => {
  const [group, setGroup] = useState<{
    id: string;
    name: string;
    currency: string;
    participants: any[];
  } | null>(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const fetchedGroup = await getGroup(groupId);
        if (!fetchedGroup) {
          notFound();
          return;
        }
        setGroup(fetchedGroup);
        const fetchedExpenses = await getGroupExpenses(fetchedGroup.id);
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        notFound(); // Handle error appropriately
      }
    };

    fetchExpenses();
  }, [groupId]);

  if (!group) {
    // Optionally, you can return a loading indicator or null while waiting for data
    return null;
  }

  return (
    <>
      <ExpenseList
        expenses={expenses}
        groupId={group.id}
        currency={group.currency}
        participants={group.participants}
      />
    </>
  );
};

export default Expenses;
