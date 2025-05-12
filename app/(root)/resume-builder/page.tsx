import React from 'react'
import { Metadata } from 'next'
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getResumesByUserId } from "@/lib/actions/resume.action";
import { redirect } from "next/navigation";
import ResumeList from "@/components/ResumeList";

export const metadata: Metadata = {
    title: 'Resume Builder - MockAI',
    description: 'Build your resume with ease using our intuitive resume builder.',
}

export default async function ResumeBuilderPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  // Fetch all resumes for this user
  const resumes = await getResumesByUserId(user.id);
  
  return (
    <div className="container mx-auto py-5">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-100 mb-4">
          Resume Builder
        </h1>
        <p className="text-light-400 text-lg">
          Create, edit, and download professional resumes tailored to your job applications.
        </p>
      </div>
      
      <ResumeList resumes={resumes} userId={user.id} />
    </div>
  );
}