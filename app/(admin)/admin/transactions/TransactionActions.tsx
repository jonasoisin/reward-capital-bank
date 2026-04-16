"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  approveTransaction,
  rejectTransaction,
  blockTransaction,
} from "@/lib/actions/transaction.actions";

interface TransactionActionsProps {
  transactionId: string;
  status: string;
  adminId: string;
}

export function TransactionActions({
  transactionId,
  status,
  adminId,
}: TransactionActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<
    "approve" | "reject" | "block" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: "approve" | "reject" | "block") => {
    setLoading(action);
    setError(null);

    let result: { success?: boolean; error?: string };

    if (action === "approve") {
      result = await approveTransaction(transactionId, adminId);
    } else if (action === "reject") {
      result = await rejectTransaction(transactionId, adminId);
    } else {
      result = await blockTransaction(transactionId, adminId);
    }

    if ("error" in result && result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }

    setLoading(null);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {status === "pending" && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="h-7 rounded-full px-3 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              disabled={loading !== null}
              onClick={() => handleAction("approve")}
            >
              {loading === "approve" ? "…" : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 rounded-full px-3 text-xs border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={loading !== null}
              onClick={() => handleAction("reject")}
            >
              {loading === "reject" ? "…" : "Reject"}
            </Button>
          </>
        )}
        {status !== "blocked" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 rounded-full px-3 text-xs border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
            disabled={loading !== null}
            onClick={() => handleAction("block")}
          >
            {loading === "block" ? "…" : "Block"}
          </Button>
        )}
      </div>
      {error && (
        <p className="text-xs" style={{ color: "var(--ds-muted-foreground)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
