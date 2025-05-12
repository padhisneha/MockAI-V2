'use client';

import { useState } from 'react';
import { Resume } from '@/types';
import { createResume, deleteResume } from '@/lib/actions/resume.action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ResumeListProps {
  resumes: Resume[];
  userId: string;
}

export default function ResumeList({ resumes, userId }: ResumeListProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeName.trim()) {
      toast.error('Please enter a name for your resume');
      return;
    }
    
    try {
      setIsCreating(true);
      const result = await createResume({
        userId,
        name: resumeName.trim()
      });
      
      if (result.success && result.resumeId) {
        toast.success('Resume created successfully');
        setShowCreateModal(false);
        setResumeName('');
        router.push(`/resume-builder/${result.resumeId}`);
      } else {
        toast.error(result.message || 'Failed to create resume');
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      setIsDeleting(resumeId);
      const result = await deleteResume({ resumeId, userId });
      
      if (result.success) {
        toast.success('Resume deleted successfully');
        router.refresh(); // Refresh the page to update the list
      } else {
        toast.error(result.message || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div>
      {/* Create New Resume Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create New Resume
        </button>
      </div>
      
      {/* Resumes Grid */}
      {resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="dark-gradient rounded-2xl border border-white/10 overflow-hidden group h-full"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-primary-100">{resume.name}</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(`/resume-builder/${resume.id}`)}
                        className="bg-dark-200 hover:bg-dark-300 p-2 rounded-full transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-100">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => router.push(`/resume-builder/${resume.id}/preview`)}
                        className="bg-dark-200 hover:bg-dark-300 p-2 rounded-full transition-colors"
                        title="Preview"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-100">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteResume(resume.id)}
                        disabled={isDeleting === resume.id}
                        className="bg-dark-200 hover:bg-destructive-200 p-2 rounded-full transition-colors"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-100">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="text-light-400">
                    {resume.personal.fullName && (
                      <p className="mb-1 text-light-100">{resume.personal.fullName}</p>
                    )}
                    
                    <p className="text-sm text-light-400">
                      Last updated: {new Date(resume.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3 justify-between">
                  <button 
                    onClick={() => router.push(`/resume-builder/${resume.id}`)}
                    className="flex-1 btn-secondary text-center text-sm py-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => router.push(`/resume-builder/${resume.id}/preview`)}
                    className="flex-1 btn-primary text-center text-sm py-2"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="blue-gradient-dark rounded-xl p-8 border border-primary-200/20 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative size-24 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary-100">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
                <path d="M8 14h8" />
                <path d="M8 18h5" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 text-primary-100">No Resumes Yet</h3>
          <p className="text-light-400 mb-6">
            You haven&apos;t created any resumes yet. Create your first resume to get started.
          </p>
          
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="btn-primary flex items-center justify-center gap-2 mx-auto group"
          >
            Create Your First Resume
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Create Resume Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="blue-gradient-dark rounded-2xl border border-primary-200/20 p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-primary-100">Create New Resume</h3>
            
            <form onSubmit={handleCreateResume}>
              <div className="mb-4">
                <label htmlFor="resumeName" className="block text-light-100 mb-2">
                  Resume Name
                </label>
                <input
                  type="text"
                  id="resumeName"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  placeholder="e.g., Software Engineer Resume"
                  className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                  required
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setResumeName('');
                  }}
                  className="flex-1 btn-secondary"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}