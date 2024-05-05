import { useEffect, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { createExpense, getGroup } from "@/services/Service";
import { expenseFormSchema } from "@/lib/schemas";
import Navbar from "@/components/Navbar";

interface Props {
  groupId: string;
}

const ExpenseFormPage: React.FC<Props> = ({ groupId }) => {
  const [group, setGroup] = useState<null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const group = await getGroup(groupId);
        setGroup(group);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [groupId]);

  const createExpenseAction = async (values: unknown) => {
    try {
      const expenseFormValues = expenseFormSchema.parse(values);
      await createExpense(expenseFormValues, groupId);
      // Assuming redirect is a function that handles navigation
      window.location.href = `/groups/${groupId}/expenses`;
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-800">
      <Navbar />
      <div className="pt-24"></div>s
      <ExpenseForm group={group} onSubmit={createExpenseAction} />
    </div>
  );
};

export default ExpenseFormPage;
