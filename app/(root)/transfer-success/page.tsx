import Link from "next/link";
import { Clock, LayoutDashboard, History, Send } from "lucide-react";

interface Props {
  searchParams: {
    amount?: string;
    currency?: string;
    recipient?: string;
    rail?: string;
    delivery?: string;
    txnId?: string;
  };
}

function formatRail(rail: string) {
  return rail.replace(/_/g, " ");
}

export default function TransferSuccessPage({ searchParams }: Props) {
  const {
    amount    = "0",
    currency  = "USD",
    recipient = "Recipient",
    rail      = "",
    delivery  = "",
    txnId     = "",
  } = searchParams;

  const displayAmount = parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
            <Clock size={40} className="text-amber-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-24 font-semibold text-gray-900">Transfer Submitted</h1>
          <p className="mt-1.5 text-14 text-gray-500">
            Your transfer is pending review. Our team will process it shortly and
            you&apos;ll be notified once it&apos;s approved.
          </p>
        </div>

        {/* Summary card */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <p className="eyebrow mb-1">Amount Submitted</p>
            <p className="text-30 font-semibold tracking-tight text-gray-900">
              ${displayAmount}
              {currency !== "USD" && (
                <span className="ml-2 text-14 font-normal text-gray-400">USD</span>
              )}
            </p>
          </div>

          <div className="divide-y divide-gray-100 px-6">
            <div className="flex items-center justify-between py-3.5">
              <span className="text-13 text-gray-500">Recipient</span>
              <span className="text-13 font-medium text-gray-900">{decodeURIComponent(recipient)}</span>
            </div>

            {rail && (
              <div className="flex items-center justify-between py-3.5">
                <span className="text-13 text-gray-500">Transfer rail</span>
                <span className="text-13 font-medium text-gray-900">{formatRail(rail)}</span>
              </div>
            )}

            {delivery && (
              <div className="flex items-center justify-between py-3.5">
                <span className="text-13 text-gray-500">Estimated delivery</span>
                <span className="text-13 font-medium text-gray-900">{delivery}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-3.5">
              <span className="text-13 text-gray-500">Status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-12 font-medium text-amber-700">
                <Clock size={10} /> Pending Review
              </span>
            </div>

            {txnId && (
              <div className="flex items-center justify-between py-3.5">
                <span className="text-13 text-gray-500">Reference ID</span>
                <span className="font-mono text-12 text-gray-500">{txnId.slice(0, 12)}…</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-14 font-medium text-white hover:bg-gray-800"
          >
            <LayoutDashboard size={15} />
            Back to Dashboard
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/dashboard/transactions"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-13 font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            >
              <History size={14} />
              View History
            </Link>
            <Link
              href="/payment-transfer"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-13 font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            >
              <Send size={14} />
              Send Another
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
