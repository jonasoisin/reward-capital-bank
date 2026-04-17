export const dynamic = "force-dynamic";

import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import QuickActions from "@/components/QuickActions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount } from "@/lib/actions/account.actions";
import { getTransactionsByUser } from "@/lib/actions/transaction.actions";
import { getUserCard, provisionCard } from "@/lib/actions/card.actions";
import { redirect } from "next/navigation";
import { formatAccountNumber } from "@/lib/utils";

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams.page as string) || 1;
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");

  const [account, cardRaw] = await Promise.all([
    getAccount(loggedIn._id),
    getUserCard(),
  ]);

  // Auto-provision for users created before card system was added
  let card = cardRaw;
  if (!card && account) {
    try {
      await provisionCard(loggedIn._id, account._id, `${loggedIn.firstName} ${loggedIn.lastName}`);
      card = await getUserCard();
    } catch { /* continue without card */ }
  }
  const { transactions, totalPages } = account
    ? await getTransactionsByUser(loggedIn._id, page)
    : { transactions: [], totalPages: 1 };

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            balance={account?.availableBalance ?? 0}
            accountNumber={
              account ? formatAccountNumber(account.accountNumber) : "—"
            }
          />
        </header>

        <QuickActions />

        <RecentTransactions
          transactions={transactions}
          page={page}
          totalPages={totalPages}
          userId={loggedIn._id}
        />
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={transactions}
        account={account}
        card={card}
      />
    </section>
  );
};

export default Home;
