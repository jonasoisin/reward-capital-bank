import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount } from "@/lib/actions/account.actions";
import { redirect } from "next/navigation";
import { formatAccountNumber } from "@/lib/utils";

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");

  const account = await getAccount(loggedIn._id);
  if (!account) redirect("/dashboard");

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Send money to another account instantly."
      />

      <section className="size-full pt-5">
        <PaymentTransferForm
          senderAccountNumber={formatAccountNumber(account.accountNumber)}
          senderBalance={account.balance}
        />
      </section>
    </section>
  );
};

export default Transfer;
