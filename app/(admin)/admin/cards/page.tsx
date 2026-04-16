import { adminGetAllCards } from "@/lib/actions/card.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import AdminCardPanel from "./AdminCardPanel";

interface Props {
  searchParams: { page?: string };
}

const AdminCardsPage = async ({ searchParams }: Props) => {
  const admin = await getLoggedInUser();
  if (!admin || admin.role !== "admin") redirect("/admin/login");

  const page = Number(searchParams.page) || 1;
  const { cards, total, totalPages } = await adminGetAllCards(page);

  return (
    <div className="admin-content">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--ds-foreground)" }}>
          Card Management
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--ds-muted-foreground)" }}>
          {total} virtual card{total !== 1 ? "s" : ""} issued
        </p>
      </div>

      <div className="space-y-4">
        {cards.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{ borderColor: "var(--ds-border)" }}
          >
            <p className="text-sm" style={{ color: "var(--ds-muted-foreground)" }}>
              No cards issued yet.
            </p>
          </div>
        ) : (
          cards.map((card: any) => (
            <AdminCardPanel key={card._id} card={card} adminId={admin._id} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <span style={{ color: "var(--ds-muted-foreground)" }}>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/admin/cards?page=${page - 1}`}
                className="rounded-xl border px-4 py-2 font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
              >
                Previous
              </a>
            )}
            {page < totalPages && (
              <a
                href={`/admin/cards?page=${page + 1}`}
                className="rounded-xl border px-4 py-2 font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: "var(--ds-border)", color: "var(--ds-foreground)" }}
              >
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCardsPage;
