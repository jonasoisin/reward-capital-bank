import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount } from "@/lib/actions/account.actions";
import { getUserCard, provisionCard } from "@/lib/actions/card.actions";
import { redirect } from "next/navigation";
import { formatAccountNumber, formatAmount } from "@/lib/utils";

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");

  const account = await getAccount(loggedIn._id);

  let card = await getUserCard();

  // Auto-provision a card for users who signed up before card provisioning was added
  if (!card && account) {
    try {
      await provisionCard(
        loggedIn._id,
        account._id,
        `${loggedIn.firstName} ${loggedIn.lastName}`
      );
      card = await getUserCard();
    } catch {
      // provisioning failed — continue without a card
    }
  }

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="Cards"
          subtext="View and manage your virtual Visa card."
        />

        <div className="space-y-6">
          {account ? (
            <>
              <BankCard
                account={account}
                card={card}
                userName={`${loggedIn.firstName} ${loggedIn.lastName}`}
                showBalance={true}
              />
              {card && (
                <div className="flex flex-col gap-1 text-sm text-gray-500 font-mono">
                  <span>Account: {formatAccountNumber(account.accountNumber)}</span>
                  <span>Balance: {formatAmount(account.availableBalance)}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400">No account found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyBanks;
