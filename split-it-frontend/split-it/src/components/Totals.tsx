// Importing components
import { TotalsGroupSpending } from "./TotalsGroupSpending";
import { TotalsYourShare } from "./TotalsYourShare";
import { TotalsYourSpendings } from "./TotalsYourSpending";

// Importing services
import { getGroup, getGroupExpenses } from "@/services/Service";

// Importing hooks
import { useActiveUser } from "@/lib/hooks";

export function Totals({
  group,
  expenses,
  totalGroupSpendings,
}: {
  group: NonNullable<Awaited<ReturnType<typeof getGroup>>>;
  expenses: NonNullable<Awaited<ReturnType<typeof getGroupExpenses>>>;
  totalGroupSpendings: number;
}) {
  const activeUser = useActiveUser(group.id);

  return (
    <>
      <TotalsGroupSpending
        totalGroupSpendings={totalGroupSpendings}
        currency={group.currency}
      />
      {activeUser && activeUser !== "None" && (
        <>
          <TotalsYourSpendings group={group} expenses={expenses} />
          <TotalsYourShare group={group} expenses={expenses} />
        </>
      )}
    </>
  );
}
