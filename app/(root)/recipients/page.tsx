import HeaderBox from "@/components/HeaderBox";
import RecipientsManager from "@/components/RecipientsManager";
import { getSavedRecipients } from "@/lib/actions/recipient.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const RecipientsPage = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");

  const result = await getSavedRecipients();
  const recipients: SavedRecipient[] = "error" in result ? [] : (result as SavedRecipient[]);

  return (
    <section className="flex flex-col gap-8 px-5 py-7 md:px-8 xl:max-h-screen xl:overflow-y-scroll">
      <HeaderBox
        title="Recipients"
        subtext="Manage your saved contacts for faster transfers."
      />
      <RecipientsManager initialRecipients={recipients} />
    </section>
  );
};

export default RecipientsPage;
