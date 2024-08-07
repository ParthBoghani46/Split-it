// Importing components
import { Money } from "@/components/Money";

// Importing functions and hooks from the lib folder
import { getBalances } from "@/lib/balances";
import { useActiveUser } from "@/lib/hooks";

type Props = {
  groupId: string;
  currency: string;
  expense: Parameters<typeof getBalances>[0][number];
};

export function ActiveUserBalance({ groupId, currency, expense }: Props) {
  const activeUserId = useActiveUser(groupId);
  if (activeUserId === null || activeUserId === "" || activeUserId === "None") {
    return null;
  }

  const balances = getBalances([expense]);
  let fmtBalance = <>You are not involved</>;
  if (activeUserId in balances) {
    const balance = balances[activeUserId];
    let balanceDetail = <></>;
    if (balance.paid > 0 && balance.paidFor > 0) {
      balanceDetail = (
        <>
          {" ("}
          <Money {...{ currency, amount: balance.paid }} />
          {" - "}
          <Money {...{ currency, amount: balance.paidFor }} />
          {")"}
        </>
      );
    }
    fmtBalance = (
      <>
        Your balance:{" "}
        <Money {...{ currency, amount: balance.total }} bold colored />
        {balanceDetail}
      </>
    );
  }
  return <div className="text-xs text-muted-foreground">{fmtBalance}</div>;
}
