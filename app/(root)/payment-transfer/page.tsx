export const dynamic = "force-dynamic";

import HeaderBox from "@/components/HeaderBox";
import MultiStepTransferForm from "@/components/MultiStepTransferForm";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount } from "@/lib/actions/account.actions";
import { redirect } from "next/navigation";
import { formatAccountNumber } from "@/lib/utils";

const Transfer = async ({
  searchParams,
}: {
  searchParams: { account?: string };
}) => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");

  const account = await getAccount(loggedIn._id);
  if (!account) redirect("/dashboard");

  const prefillAccountNumber = searchParams.account?.trim() || undefined;

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Transfer Money"
        subtext="Send funds domestically or internationally in a few steps."
      />
      <section className="size-full pt-5">
        <MultiStepTransferForm
          senderAccountNumber={formatAccountNumber(account.accountNumber)}
          senderBalance={account.availableBalance}
          prefillAccountNumber={prefillAccountNumber}
        />
      </section>
    </section>
  );
};

export default Transfer;
