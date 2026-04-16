import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatAmount, formatDateTime } from "@/lib/utils";

const statusColors: Record<string, string> = {
  completed: "text-green-700 bg-green-50",
  pending:   "text-amber-700 bg-amber-50",
  approved:  "text-blue-700 bg-blue-50",
  rejected:  "text-red-700 bg-red-50",
  blocked:   "text-gray-600 bg-gray-100",
};

const TransactionsTable = ({
  transactions,
  userId,
}: TransactionTableProps) => {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--ds-border)" }}>
      <Table>
        <TableHeader>
          <TableRow style={{ background: "var(--ds-muted)" }}>
            <TableHead className="px-4 py-3">
              <span className="eyebrow">Type</span>
            </TableHead>
            <TableHead className="px-4 py-3">
              <span className="eyebrow">Amount</span>
            </TableHead>
            <TableHead className="px-4 py-3">
              <span className="eyebrow">Status</span>
            </TableHead>
            <TableHead className="px-4 py-3">
              <span className="eyebrow">Date</span>
            </TableHead>
            <TableHead className="px-4 py-3 max-md:hidden">
              <span className="eyebrow">Note</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-12 text-center text-14"
                style={{ color: "var(--ds-muted-foreground)" }}
              >
                No transactions yet.
              </TableCell>
            </TableRow>
          )}
          {transactions.map((t: Transaction) => {
            const isCredit =
              t.type === "credit" ||
              (t.type === "transfer" &&
                (typeof t.receiverId === "string"
                  ? t.receiverId === userId
                  : (t.receiverId as unknown as { _id: string })?._id === userId));
            const isDebit = t.type === "debit" || (t.type === "transfer" && !isCredit);

            return (
              <TableRow
                key={t._id}
                className="border-b transition-colors hover:bg-gray-50"
                style={{ borderColor: "var(--ds-border)" }}
              >
                <TableCell className="px-4 py-3">
                  <span className="text-14 font-medium capitalize" style={{ color: "var(--ds-foreground)" }}>
                    {t.type}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <span
                    className={cn(
                      "text-14 font-semibold",
                      isDebit ? "text-red-600" : "text-green-600"
                    )}
                  >
                    {isDebit ? `-${formatAmount(t.amount)}` : `+${formatAmount(t.amount)}`}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-12 font-medium capitalize",
                      statusColors[t.status] ?? "text-gray-600 bg-gray-100"
                    )}
                  >
                    {t.status}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-3 text-14 whitespace-nowrap" style={{ color: "var(--ds-muted-foreground)" }}>
                  {formatDateTime(new Date(t.createdAt)).dateTime}
                </TableCell>

                <TableCell className="px-4 py-3 max-md:hidden text-14" style={{ color: "var(--ds-muted-foreground)" }}>
                  {t.note || "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
