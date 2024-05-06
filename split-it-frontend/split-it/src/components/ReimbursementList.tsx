// Importing UI component
import { Button } from "@/components/ui/button";

// Importing Reimbursement type from balances module
import { Reimbursement } from "@/lib/balances";

// Importing utility function from utils module
import { formatCurrency } from "@/lib/utils";

// Importing Link component from react-router-dom
import { Link } from "react-router-dom";

interface Participant {
  id: string;
  name: string;
}
type Props = {
  reimbursements: Reimbursement[];
  participants: Participant[];
  currency: string;
  groupId: string;
};

export function ReimbursementList({
  reimbursements,
  participants,
  currency,
  groupId,
}: Props) {
  if (reimbursements.length === 0) {
    return (
      <p className="px-6 text-sm pb-6">
        It looks like your group doesn’t need any reimbursement 😁
      </p>
    );
  }

  const getParticipant = (id: string) => participants.find((p) => p.id === id);
  return (
    <div className="text-sm">
      {reimbursements.map((reimbursement, index) => (
        <div
          className="border-t border-slate-300 dark:border-slate-500 px-6 py-4 flex justify-between"
          key={index}
        >
          <div className="flex flex-col gap-1 text-lg items-start sm:flex-row sm:items-baseline sm:gap-4">
            <div>
              <strong>{getParticipant(reimbursement.from)?.name}</strong>
              {"  "} owes
              {"  "}
              <strong>{getParticipant(reimbursement.to)?.name}</strong>
            </div>
            <Button
              variant="link"
              asChild
              className="mx-auto text-green-700 dark:text-primary hover:underline"
            >
              <Link
                to={`/groups/${groupId}/expenses/create?reimbursement=yes&from=${reimbursement.from}&to=${reimbursement.to}&amount=${reimbursement.amount}`}
              >
                Mark as paid
              </Link>
            </Button>
          </div>
          <div>{formatCurrency(currency, reimbursement.amount)}</div>
        </div>
      ))}
    </div>
  );
}
