// Importing services
import { getGroup, getGroupExpenses } from "@/services/Service";

// Importing custom hooks
import { useActiveUser } from "@/lib/hooks";

// Importing functions related to totals
import { getTotalActiveUserPaidFor } from "@/lib/totals";

// Importing utility function for currency formatting
import { formatCurrency } from "@/lib/utils";

type Props = {
  group: NonNullable<Awaited<ReturnType<typeof getGroup>>>;
  expenses: NonNullable<Awaited<ReturnType<typeof getGroupExpenses>>>;
};

export function TotalsYourSpendings({ group, expenses }: Props) {
  const activeUser = useActiveUser(group.id);
  console.log(activeUser);

  const totalYourSpendings =
    activeUser === "" || activeUser === "None"
      ? 0
      : getTotalActiveUserPaidFor(activeUser, expenses);
  console.log(getTotalActiveUserPaidFor(activeUser, expenses));
  const currency = group.currency;

  return (
    <div>
      <div className="text-muted-foreground">Total you paid for</div>

      <div className="text-lg">
        {formatCurrency(currency, totalYourSpendings)}
      </div>
    </div>
  );
}
