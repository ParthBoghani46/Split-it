/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGroupExpenses } from "@/services/Service";

export function getTotalGroupSpending(
  expenses: NonNullable<Awaited<ReturnType<typeof getGroupExpenses>>>
): number {
  return expenses.reduce(
    (total: number, expense: { isReimbursement: boolean; amount: number }) =>
      expense.isReimbursement ? total : total + expense.amount,
    0
  );
}

export function getTotalActiveUserPaidFor(
  activeUserId: string | null,
  expenses: NonNullable<Awaited<ReturnType<typeof getGroupExpenses>>>
): number {
  console.log(expenses);
  console.log(activeUserId);

  return expenses.reduce(
    (
      total: any,
      expense: {
        paidBy: string | null;
        isReimbursement: any;
        amount: any;
      }
    ) =>
      expense.paidBy === activeUserId && !expense.isReimbursement
        ? total + expense.amount
        : total,
    0
  );
}

export function getTotalActiveUserShare(
  activeUserId: string | null,
  expenses: NonNullable<Awaited<ReturnType<typeof getGroupExpenses>>>
): number {
  let total = 0;

  expenses.forEach(
    (expense: {
      isReimbursement: any;
      paidFor: any;
      splitMode: any;
      amount: number;
    }) => {
      if (expense.isReimbursement) return;

      const paidFors = expense.paidFor;
      const userPaidFor = paidFors.find(
        (paidFor: { participantId: string | null }) =>
          paidFor.participantId === activeUserId
      );

      if (!userPaidFor) {
        // If the active user is not involved in the expense, skip it
        return;
      }

      switch (expense.splitMode) {
        case "EVENLY":
          // Divide the total expense evenly among all participants
          total += expense.amount / paidFors.length;
          break;
        case "BY_AMOUNT":
          // Directly add the user's share if the split mode is BY_AMOUNT
          total += userPaidFor.shares;
          break;
        case "BY_PERCENTAGE":
          // Calculate the user's share based on their percentage of the total expense
          total += (expense.amount * userPaidFor.shares) / 100; // Assuming shares are out of 10000 for percentage
          break;
        case "BY_SHARES":
          // Calculate the user's share based on their shares relative to the total shares
          // eslint-disable-next-line no-case-declarations
          const totalShares = paidFors.reduce(
            (sum: number, paidFor: { shares: number }) => sum + paidFor.shares,
            0
          );
          console.log(paidFors);
          total += (expense.amount * userPaidFor.shares) / totalShares;

          break;
      }
    }
  );

  return parseFloat(total.toFixed(2));
}

// (sum: number, paidFor: { shares: number }) =>
//   sum +
//   (paidFor.shares != 1 ? paidFor.shares / 100 : paidFor.shares),
// 0
// );
