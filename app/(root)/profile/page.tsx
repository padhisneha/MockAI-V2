import { getCurrentUser } from "@/lib/actions/auth.action";
import Profile from "@/components/Profile";
import { redirect } from "next/navigation";
import { getFeedbacksByUserId } from "@/lib/actions/general.action";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  // Fetch all feedback data for this user
  const feedbacks = await getFeedbacksByUserId(user.id);
  
  return (
    <div className="container mx-auto py-5">
      <Profile user={user} feedbacks={feedbacks} />
    </div>
  );
}