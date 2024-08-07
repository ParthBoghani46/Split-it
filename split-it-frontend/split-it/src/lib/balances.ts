/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGroupExpenses } from "@/services/Service";

interface Participant {
  id: string;
  name: string;
}

export type Balances = Record<
  Participant["id"],
  { paid: number; paidFor: number; total: number }
>;

export type Reimbursement = {
  from: Participant["id"];
  to: Participant["id"];
  amount: number;
};

export function getBalances(
  expenses: NonNullable<Awaited<ReturnType<typeof getGroupExpenses>>>
): Balances {
  const balances: Balances = {};

  for (const expense of expenses) {
    const paidBy = expense.paidBy;
    const paidFors = expense.paidFor;

    if (!balances[paidBy]) balances[paidBy] = { paid: 0, paidFor: 0, total: 0 };
    balances[paidBy].paid += expense.amount;

    const totalPaidForShares = paidFors.reduce(
      (sum: any, paidFor: { shares: number }) => sum + paidFor.shares,
      0
    );

    let remaining = expense.amount;
    paidFors.forEach(
      (
        paidFor: { participantId: string | number; shares: number },
        index: number
      ) => {
        if (!balances[paidFor.participantId])
          balances[paidFor.participantId] = { paid: 0, paidFor: 0, total: 0 };

        const isLast = index === paidFors.length - 1;

        let shares: number;
        let totalShares: number;

        switch (expense.splitMode) {
          case "EVENLY":
            shares = 1;
            totalShares = paidFors.length;
            break;
          case "BY_SHARES":
          case "BY_PERCENTAGE":
          case "BY_AMOUNT":
            shares = paidFor.shares;
            totalShares = totalPaidForShares;
            break;
          default:
            // Handle the case where expense.splitMode doesn't match any known pattern
            throw new Error(`Unknown split mode: ${expense.splitMode}`);
        }

        const dividedAmount = isLast
          ? remaining
          : (expense.amount * shares) / totalShares;
        remaining -= dividedAmount;
        balances[paidFor.participantId].paidFor += dividedAmount;
      }
    );
  }

  // rounding and add total
  for (const participantId in balances) {
    // add +0 to avoid negative zeros
    balances[participantId].paidFor =
      Math.round(balances[participantId].paidFor) + 0;
    balances[participantId].paid = Math.round(balances[participantId].paid) + 0;

    balances[participantId].total =
      balances[participantId].paid - balances[participantId].paidFor;
  }
  return balances;
}

export function getPublicBalances(reimbursements: Reimbursement[]): Balances {
  const balances: Balances = {};
  reimbursements.forEach((reimbursement) => {
    if (!balances[reimbursement.from])
      balances[reimbursement.from] = { paid: 0, paidFor: 0, total: 0 };

    if (!balances[reimbursement.to])
      balances[reimbursement.to] = { paid: 0, paidFor: 0, total: 0 };

    balances[reimbursement.from].paidFor += reimbursement.amount;
    balances[reimbursement.from].total -= reimbursement.amount;

    balances[reimbursement.to].paid += reimbursement.amount;
    balances[reimbursement.to].total += reimbursement.amount;
  });
  console.log(balances);
  return balances;
}

export function getSuggestedReimbursements(
  balances: Balances
): Reimbursement[] {
  const balancesArray = Object.entries(balances)
    .map(([participantId, { total }]) => ({ participantId, total }))
    .filter((b) => b.total !== 0);
  balancesArray.sort((b1, b2) => b2.total - b1.total);
  const reimbursements: Reimbursement[] = [];
  while (balancesArray.length > 1) {
    const first = balancesArray[0];
    const last = balancesArray[balancesArray.length - 1];
    const amount = first.total + last.total;
    if (first.total > -last.total) {
      reimbursements.push({
        from: last.participantId,
        to: first.participantId,
        amount: -last.total,
      });
      first.total = amount;
      balancesArray.pop();
    } else {
      reimbursements.push({
        from: last.participantId,
        to: first.participantId,
        amount: first.total,
      });
      last.total = amount;
      balancesArray.shift();
    }
  }
  return reimbursements.filter(({ amount }) => Math.round(amount) + 0 !== 0);
}
