/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ActiveUserBalance } from "@/components/ActiveUserBalence";
import CategoryIcon from "@/assets/CategoryIcon";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { getCategories, getGroup, getGroupExpenses } from "@/services/Service";
import { cn, formatCurrency, formatExpenseDate } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { getTotalGroupSpending } from "@/lib/totals";
import { PieChart, Pie, Cell } from "recharts";
const notFound = () => <h1>404 - Not Found</h1>;

interface Expense {
  id: string;
  title: string;
  categoryId: any;
  amount: number;
  expenseDate: string; // Assuming this is a string representation of a date
  paidById: string;
  paidFor: PaidFor[];
  isReimbursement: boolean;
}

interface PaidFor {
  participantId: string;
  // Add other properties if needed
}

interface Participant {
  id: string;
  name: string;
  // Add other properties if needed
}

type Props = {
  expenses: Awaited<ReturnType<typeof getGroupExpenses>>;
  participants: Participant[];
  currency: string;
  groupId: string;
};

const EXPENSE_GROUPS = {
  UNCATEGORIZED: "Uncategorized",
  ENTERTAINMENT: "Entertainment",
  FOOD_AND_DRINK: "Food and Drink",
  HOME: "Home",
  LIFE: "Life",
  TRANSPORTATION: "Transportation",
  UTILITIES: "Utilities",
};

const categories = await getCategories();

function getCategoryGrouping(categoryId: number): string {
  const category = categories.find(
    (cat: { id: number }) => cat.id === categoryId
  );
  return category ? category.grouping : undefined;
}

function getGroupedExpensesByCategory(
  expenses: Awaited<ReturnType<typeof getGroupExpenses>> | undefined
) {
  if (!expenses || !Array.isArray(expenses)) {
    return {}; // Return an empty object if expenses is not an array
  }

  return expenses.reduce(
    (result: { [key: string]: Expense[] }, expense: Expense) => {
      const expenseGroup = getCategoryGrouping(expense.categoryId);
      result[expenseGroup] = result[expenseGroup] ?? [];
      result[expenseGroup].push(expense);
      return result;
    },
    {}
  );
}

function generateSpendingPerCategory(
  expenses: Awaited<ReturnType<typeof getGroupExpenses>> | undefined
) {
  if (!expenses || !Array.isArray(expenses)) {
    return {}; // Return an empty object if expenses is not an array
  }

  const spendingPerCategory: { [key: string]: number } = {};

  expenses.forEach((expense) => {
    if (!expense.isReimbursement) {
      const categoryGrouping = getCategoryGrouping(expense.categoryId);
      spendingPerCategory[categoryGrouping] =
        (spendingPerCategory[categoryGrouping] || 0) + expense.amount;
    }
  });

  return spendingPerCategory;
}

export function TestList({ expenses, currency, participants, groupId }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_group, setGroup] = useState<any>(null);
  const [totalGroupSpendings, setTotalGroupSpendings] = useState<number>(0);

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
        setGroup(groupResponse);

        // Fetch group expenses
        const expensesResponse = await getGroupExpenses(groupId);

        // Calculate total group spending
        const totalSpendings = getTotalGroupSpending(expensesResponse);
        setTotalGroupSpendings(totalSpendings);
      } catch (error) {
        console.error("Error fetching group data:", error);
        // Handle error
      }
    };

    fetchData();
  }, [groupId]);

  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const activeUser = localStorage.getItem("newGroup-activeUser");
    const newUser = localStorage.getItem(`${groupId}-newUser`);
    if (activeUser || newUser) {
      localStorage.removeItem("newGroup-activeUser");
      localStorage.removeItem(`${groupId}-newUser`);
      if (activeUser === "None") {
        localStorage.setItem(`${groupId}-activeUser`, "None");
      } else {
        const userId = participants.find(
          (p) => p.name === (activeUser || newUser)
        )?.id;
        if (userId) {
          localStorage.setItem(`${groupId}-activeUser`, userId);
        }
      }
    }
  }, [groupId, participants]);

  const getParticipant = (id: string) => participants.find((p) => p.id === id);

  const groupedExpensesByCategory = getGroupedExpensesByCategory(expenses);

  const groupedSpendingPerCategory = generateSpendingPerCategory(expenses);

  function calculatePercentageSpending(
    groupedSpendingPerCategory: { [x: string]: number },
    totalGroupSpendings: number
  ) {
    const resultArray = [];

    // Iterate over each expense group
    for (const expenseGroup in groupedSpendingPerCategory) {
      // Calculate percentage spending
      const percentage =
        (groupedSpendingPerCategory[expenseGroup] * 100) / totalGroupSpendings;

      // Create key-value pair and push it to the result array
      const keyValue = {
        name: expenseGroup,
        value: Number(percentage.toFixed(2)),
      };
      resultArray.push(keyValue);
    }

    return resultArray;
  }
  const data = calculatePercentageSpending(
    groupedSpendingPerCategory,
    totalGroupSpendings
  );

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF1919",
    "#19FF95",
    "#19CAFF",
  ];
  return expenses.length > 0 ? (
    <>
      <div className="mx-auto">
        <PieChart width={500} height={500}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
      <SearchBar
        className="w-full h-10 text-card dark:text-white rounded-lg dark:bg-zinc-600 bg-white"
        onChange={(e) => setSearchText(e.target.value)}
      />
      {Object.values(EXPENSE_GROUPS).map((expenseGroup: string) => {
        let groupExpenses = groupedExpensesByCategory[expenseGroup];
        if (!groupExpenses) return null;

        groupExpenses = groupExpenses.filter(({ title }: { title: string }) =>
          title.toLowerCase().includes(searchText.toLowerCase())
        );

        if (groupExpenses.length === 0) return null;

        return (
          <div key={expenseGroup}>
            <div
              className={
                "pl-4 sm:pl-6 py-1  flex flex-row justify-between sticky top-16  "
              }
            >
              <div className="font-semibold text-lg">{expenseGroup}</div>
              <div className="text-md mr-6 ">
                {(
                  (groupedSpendingPerCategory[expenseGroup] * 100) /
                  totalGroupSpendings
                ).toFixed(2)}{" "}
                {"% spending on "}
                {expenseGroup}
              </div>
            </div>
            {groupExpenses.map((expense: any) => (
              <div
                key={expense.id}
                className={cn(
                  "flex justify-between sm:mx-6 px-4 sm:rounded-lg sm:pr-2 sm:pl-4 py-4 text-sm cursor-pointer dark:hover:bg-zinc-600 hover:bg-white gap-1 items-stretch",
                  expense.isReimbursement && "italic"
                )}
                onClick={() => {
                  window.location.href = `/groups/${groupId}/expenses/${expense.id}/edit`;
                }}
              >
                <CategoryIcon categoryId={expense.categoryId} />
                <div className="flex-1">
                  <div
                    className={cn("mb-1", expense.isReimbursement && "italic")}
                  >
                    {expense.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Paid by{" "}
                    <strong>{getParticipant(expense.paidBy)?.name}</strong> for{" "}
                    {expense.paidFor.map((paidFor: any, index: number) => (
                      <Fragment key={index}>
                        {index !== 0 && <>, </>}
                        <strong>
                          {
                            participants.find(
                              (p) => p.id === paidFor.participantId
                            )?.name
                          }
                        </strong>
                      </Fragment>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <ActiveUserBalance {...{ groupId, currency, expense }} />
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <div
                    className={cn(
                      "tabular-nums whitespace-nowrap",
                      expense.isReimbursement ? "italic" : "font-bold"
                    )}
                  >
                    {formatCurrency(currency, expense.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatExpenseDate(new Date(expense.expenseDate))}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="link"
                  className="self-center hidden sm:flex"
                  asChild
                >
                  <Link to={`/groups/${groupId}/expenses/${expense.id}/edit`}>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        );
      })}
    </>
  ) : (
    <p className="px-6 text-sm py-6">
      Your group doesn’t contain any expense yet.{" "}
      <Button variant="link" asChild className="hover:underline text-primary">
        <Link to={`/groups/${groupId}/expenses/create`}>
          Create the first one
        </Link>
      </Button>
    </p>
  );
}
