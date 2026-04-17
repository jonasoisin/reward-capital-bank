import HeaderBox from "@/components/HeaderBox";
import { Pagination } from "@/components/Pagination";
import TransactionsTable from "@/components/TransactionsTable";
import TransactionFilters from "@/components/TransactionFilters";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount } from "@/lib/actions/account.actions";
import { getTransactionsByUser } from "@/lib/actions/transaction.actions";
import { formatAmount, formatAccountNumber } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const TransactionHistory = async ({
  searchParams,
}: SearchParamProps) => {
  const currentPage  = Number(searchParams.page  as string) || 1;
  const type         = searchParams.type        as string | undefined;
  const startDate    = searchParams.startDate   as string | undefined;
  const endDate      = searchParams.endDate     as string | undefined;
  const search       = searchParams.search      as string | undefined;

  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");

  const account = await getAccount(loggedIn._id);
  const { transactions, totalPages, total } = account
    ? await getTransactionsByUser(loggedIn._id, currentPage, { type, startDate, endDate, search })
    : { transactions: [], totalPages: 1, total: 0 };

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="Search, filter, and export your full transaction record."
        />
      </div>

      <div className="space-y-6">
        {account && (
          <div className="transactions-account">
            <div className="flex flex-col gap-2">
              <h2 className="text-18 font-bold text-white">Checking Account</h2>
              <p className="text-14 font-semibold tracking-[1.1px] text-white">
                {formatAccountNumber(account.accountNumber)}
              </p>
            </div>
            <div className="transactions-account-balance">
              <p className="text-14">Current balance</p>
              <p className="text-24 text-center font-bold">
                {formatAmount(account.availableBalance)}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <Suspense>
          <TransactionFilters />
        </Suspense>

        {/* Result count */}
        <p className="text-12 text-gray-500">
          {total ?? transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
          {(type || startDate || endDate || search) ? " matched" : " total"}
        </p>

        <section className="flex w-full flex-col gap-6">
          {transactions.length > 0 ? (
            <TransactionsTable transactions={transactions} userId={loggedIn._id} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-16 text-center">
              <p className="text-14 font-medium text-gray-500">No transactions found</p>
              <p className="text-12 text-gray-400">Try adjusting your filters</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
