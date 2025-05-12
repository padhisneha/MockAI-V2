import { getCurrentUser } from "@/lib/actions/auth.action";
import { getResumeById } from "@/lib/actions/resume.action";
import { redirect } from "next/navigation";
import ResumeEditor from "@/components/ResumeEditor";

export default async function ResumeEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const resume = await getResumeById({
    resumeId: params.id,
    userId: user.id,
  });

  if (!resume) {
    redirect("/resume-builder");
  }

  return (
    <div className="container mx-auto py-5">
      <ResumeEditor resume={resume} userId={user.id} />
    </div>
  );
}
