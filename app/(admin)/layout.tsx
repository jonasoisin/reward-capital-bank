import { getSessionUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getSessionUser();

  // Middleware already enforces admin role — this is a fallback for the sidebar name only.
  // If somehow rendered without a valid session, show a placeholder name.
  const adminName = user ? `${user.firstName} ${user.lastName}` : "Admin";

  return (
    <div className="min-h-screen" style={{ background: "var(--ds-background)" }}>
      <AdminSidebar adminName={adminName} />

      <main
        className="overflow-y-auto"
        style={{ marginLeft: "256px", minHeight: "100vh", background: "var(--ds-background)" }}
      >
        {children}
      </main>
    </div>
  );
}
