/* eslint-disable @typescript-eslint/no-explicit-any */

// Importing components
import { ActiveUserBalance } from "@/components/ActiveUserBalence";

// Importing UI components
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";

// Importing services
import { getGroupExpenses } from "@/services/Service";

// Importing utilities
import { cn, formatCurrency, formatExpenseDate } from "@/lib/utils";

// Importing external dependencies
import dayjs, { type Dayjs } from "dayjs";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";

// Importing assets
import CategoryIcon from "@/assets/CategoryIcon";

interface Expense {
  id: string;
  title: string;
  category: string;
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
  UPCOMING: "Upcoming",
  THIS_WEEK: "This week",
  EARLIER_THIS_MONTH: "Earlier this month",
  LAST_MONTH: "Last month",
  EARLIER_THIS_YEAR: "Earlier this year",
  LAST_YEAR: "Last year",
  OLDER: "Older",
};

function getExpenseGroup(date: Dayjs, today: Dayjs) {
  if (today.isBefore(date)) {
    return EXPENSE_GROUPS.UPCOMING;
  } else if (today.isSame(date, "week")) {
    return EXPENSE_GROUPS.THIS_WEEK;
  } else if (today.isSame(date, "month")) {
    return EXPENSE_GROUPS.EARLIER_THIS_MONTH;
  } else if (today.subtract(1, "month").isSame(date, "month")) {
    return EXPENSE_GROUPS.LAST_MONTH;
  } else if (today.isSame(date, "year")) {
    return EXPENSE_GROUPS.EARLIER_THIS_YEAR;
  } else if (today.subtract(1, "year").isSame(date, "year")) {
    return EXPENSE_GROUPS.LAST_YEAR;
  } else {
    return EXPENSE_GROUPS.OLDER;
  }
}
function getGroupedExpensesByDate(
  expenses: Awaited<ReturnType<typeof getGroupExpenses>> | undefined
) {
  if (!expenses || !Array.isArray(expenses)) {
    return {}; // Return an empty object if expenses is not an array
  }

  const today = dayjs();
  return expenses.reduce(
    (result: { [key: string]: Expense[] }, expense: Expense) => {
      const expenseGroup = getExpenseGroup(dayjs(expense.expenseDate), today);
      result[expenseGroup] = result[expenseGroup] ?? [];
      result[expenseGroup].push(expense);
      return result;
    },
    {}
  );
}

export function ExpenseList({
  expenses,
  currency,
  participants,
  groupId,
}: Props) {
  // console.log(expenses);
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

  const groupedExpensesByDate = getGroupedExpensesByDate(expenses);

  return expenses.length > 0 ? (
    <>
      <SearchBar
        className="w-full h-10 text-card dark:text-white rounded-lg dark:bg-zinc-600 bg-white"
        onChange={(e) => setSearchText(e.target.value)}
      />
      {Object.values(EXPENSE_GROUPS).map((expenseGroup: string) => {
        let groupExpenses = groupedExpensesByDate[expenseGroup];
        if (!groupExpenses) return null;

        groupExpenses = groupExpenses.filter(({ title }: { title: string }) =>
          title.toLowerCase().includes(searchText.toLowerCase())
        );

        if (groupExpenses.length === 0) return null;

        return (
          <div key={expenseGroup}>
            <div
              className={
                "text-lg pl-4 sm:pl-6 py-1 font-semibold sticky top-16  "
              }
            >
              {expenseGroup}
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
    <p className="px-6 text-lg py-6">
      Your group doesn’t contain any expense yet.{" "}
      <Button variant="link" asChild className="hover:underline text-primary">
        <Link to={`/groups/${groupId}/expenses/create`}>
          Create the first one
        </Link>
      </Button>
    </p>
  );
}
