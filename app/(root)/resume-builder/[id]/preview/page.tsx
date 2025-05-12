import { getCurrentUser } from "@/lib/actions/auth.action";
import { getResumeById } from "@/lib/actions/resume.action";
import { redirect } from "next/navigation";
import ResumePreview from "@/components/ResumePreview";

type ResumePreviewPageProps = {
  params: { id: string };
};

export default async function ResumePreviewPage({ params }: ResumePreviewPageProps) {
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
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-100">
          Resume Preview: {resume.name}
        </h1>
      </div>

      <ResumePreview resume={resume} />
    </div>
  );
}
