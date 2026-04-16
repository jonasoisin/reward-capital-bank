import HeaderBox from "@/components/HeaderBox";
import ProfileForm from "@/components/ProfileForm";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const Profile = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");

  return (
    <section className="flex flex-col gap-8 px-5 py-7 md:px-8 xl:max-h-screen xl:overflow-y-scroll">
      <HeaderBox
        title="Profile"
        subtext="Manage your personal information and security settings."
      />
      <ProfileForm user={loggedIn} />
    </section>
  );
};

export default Profile;
