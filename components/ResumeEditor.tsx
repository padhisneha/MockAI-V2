'use client';

import { useState } from 'react';
import { Resume, EducationEntry, ExperienceEntry, ProjectEntry } from '@/types';
import { updateResume } from '@/lib/actions/resume.action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface ResumeEditorProps {
  resume: Resume;
  userId: string;
}

export default function ResumeEditor({ resume, userId }: ResumeEditorProps) {
  const router = useRouter();
  const [currentResume, setCurrentResume] = useState<Resume>(resume);
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [isSaving, setIsSaving] = useState(false);
  
  // Function to handle changes to personal information
  const handlePersonalChange = (field: string, value: string) => {
    setCurrentResume(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };
  
  // Function to handle changes to professional summary
  const handleSummaryChange = (value: string) => {
    setCurrentResume(prev => ({
      ...prev,
      professionalSummary: value
    }));
  };
  
  // Function to handle changes to skills
  const handleSkillsChange = (skills: string) => {
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    setCurrentResume(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };
  
  // Function to add a new education entry
  const addEducation = () => {
    const newEducation: EducationEntry = {
      id: uuidv4(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      location: ''
    };
    
    setCurrentResume(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };
  
  // Function to update an education entry
  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    setCurrentResume(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };
  
  // Function to remove an education entry
  const removeEducation = (id: string) => {
    setCurrentResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };
  
  // Function to add a new experience entry
  const addExperience = () => {
    const newExperience: ExperienceEntry = {
      id: uuidv4(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      bullets: []
    };
    
    setCurrentResume(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };
  
  // Function to update an experience entry
  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string | string[]) => {
    setCurrentResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };
  
  // Function to update experience bullets
  const updateExperienceBullets = (id: string, bullets: string) => {
    const bulletsArray = bullets.split('\n').map(bullet => bullet.trim()).filter(bullet => bullet);
    
    setCurrentResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, bullets: bulletsArray } : exp
      )
    }));
  };
  
  // Function to remove an experience entry
  const removeExperience = (id: string) => {
    setCurrentResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };
  
  // Function to add a new project entry
  const addProject = () => {
    const newProject: ProjectEntry = {
      id: uuidv4(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    };
    
    setCurrentResume(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };
  
  // Function to update a project entry
  const updateProject = (id: string, field: keyof ProjectEntry, value: string | string[]) => {
    setCurrentResume(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };
  
  // Function to update project technologies
  const updateProjectTechnologies = (id: string, technologies: string) => {
    const techArray = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    
    setCurrentResume(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, technologies: techArray } : proj
      )
    }));
  };
  
  // Function to remove a project entry
  const removeProject = (id: string) => {
    setCurrentResume(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };
  
  // Function to save the resume
  const saveResume = async () => {
    try {
      setIsSaving(true);
      
      const result = await updateResume({
        resumeId: currentResume.id,
        userId,
        data: currentResume
      });
      
      if (result.success) {
        toast.success('Resume saved successfully');
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to navigate to the preview page
  const goToPreview = () => {
    router.push(`/resume-builder/${currentResume.id}/preview`);
  };
  
  // Function to go back to the resume list page
  const goBack = () => {
    router.push('/resume-builder');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-100 mb-2">
            {currentResume.name}
          </h1>
          <p className="text-light-400">
            Update your resume information below
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={goBack}
            className="btn-secondary"
          >
            Back
          </button>
          <button 
            onClick={saveResume}
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={goToPreview}
            className="btn-primary-outline"
          >
            Preview
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 p-1 min-w-min">
          {['personal', 'summary', 'education', 'experience', 'skills', 'projects'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeSection === section 
                  ? 'bg-primary-100 text-dark-300' 
                  : 'text-light-100 hover:bg-dark-200'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="blue-gradient-dark rounded-xl p-6 border border-primary-200/20">
        {/* Personal Information Section */}
        {activeSection === 'personal' && (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-primary-100">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-light-100 mb-2">Full Name</label>
                <input
                  type="text"
                  value={currentResume.personal.fullName}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                  placeholder="e.g., John Smith"
                />
              </div>
              
              <div>
                <label className="block text-light-100 mb-2">Email</label>
                <input
                  type="email"
                  value={currentResume.personal.email}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                  placeholder="e.g., john.smith@example.com"
                />
              </div>
              
              <div>
                <label className="block text-light-100 mb-2">Phone</label>
                <input
                  type="tel"
                  value={currentResume.personal.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                  placeholder="e.g., (123) 456-7890"
                />
              </div>
              
              <div>
                <label className="block text-light-100 mb-2">Location</label>
                <input
                  type="text"
                  value={currentResume.personal.location}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                  className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                  placeholder="e.g., New York, NY"
                />
              </div>
              
              <div>
                <label className="block text-light-100 mb-2">Website (Optional)</label>
                <input
                  type="url"
                  value={currentResume.personal.website || ''}
                  onChange={(e) => handlePersonalChange('website', e.target.value)}
                  className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                  placeholder="e.g., https://yourwebsite.com"
                />
              </div>
              
              <div>
                <label className="block text-light-100 mb-2">LinkedIn (Optional)</label>
                <input
                  type="url"
                  value={currentResume.personal.linkedin || ''}
                  onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                  className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                  placeholder="e.g., https://linkedin.com/in/yourprofile"
                />
              </div>
              
              <div>
                <label className="block text-light-100 mb-2">GitHub (Optional)</label>
                <input
                  type="url"
                  value={currentResume.personal.github || ''}
                  onChange={(e) => handlePersonalChange('github', e.target.value)}
                  className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                  placeholder="e.g., https://github.com/yourusername"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Professional Summary Section */}
        {activeSection === 'summary' && (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-primary-100">Professional Summary</h2>
            
            <div>
              <label className="block text-light-100 mb-2">
                Write a concise overview of your professional background
              </label>
              <textarea
                value={currentResume.professionalSummary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                className="w-full bg-dark-200 rounded-xl min-h-36 p-5 placeholder:text-light-400 text-light-100"
                placeholder="e.g., Experienced software engineer with 5+ years of experience in web development..."
              />
            </div>
          </div>
        )}
        
        {/* Education Section */}
        {activeSection === 'education' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-primary-100">Education</h2>
              <button 
                onClick={addEducation}
                className="btn-secondary-sm"
              >
                Add Education
              </button>
            </div>
            
            {currentResume.education.length === 0 ? (
              <div className="text-center py-8 text-light-400">
                <p>No education entries yet. Click &quot;Add Education&quot; to add your educational background.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {currentResume.education.map((edu) => (
                  <div key={edu.id} className="dark-gradient rounded-xl p-6 border border-white/10">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-semibold text-lg text-primary-100">Education Entry</h3>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-destructive-100 hover:text-destructive-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <label className="block text-light-100 mb-2">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., University of California, Berkeley"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Bachelor of Science"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">Location (Optional)</label>
                        <input
                          type="text"
                          value={edu.location || ''}
                          onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Berkeley, CA"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">Start Date</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Sep 2018"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">End Date (or &quot;Present&quot;)</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., May 2022 or Present"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-light-100 mb-2">Description (Optional)</label>
                        <textarea
                          value={edu.description || ''}
                          onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                          className="w-full bg-dark-200 rounded-xl min-h-24 p-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Relevant coursework, achievements, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-primary-100">Experience</h2>
              <button 
                onClick={addExperience}
                className="btn-secondary-sm"
              >
                Add Experience
              </button>
            </div>
            
            {currentResume.experience.length === 0 ? (
              <div className="text-center py-8 text-light-400">
                <p>No experience entries yet. Click &quot;Add Experience&quot; to add your work history.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {currentResume.experience.map((exp) => (
                  <div key={exp.id} className="dark-gradient rounded-xl p-6 border border-white/10">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-semibold text-lg text-primary-100">Experience Entry</h3>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-destructive-100 hover:text-destructive-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <label className="block text-light-100 mb-2">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Google"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Jan 2020"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">End Date (or &quot;Present&quot;)</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Dec 2022 or Present"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">Location (Optional)</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., San Francisco, CA"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-light-100 mb-2">Brief Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          className="w-full bg-dark-200 rounded-xl min-h-24 p-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Brief overview of your role"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-light-100 mb-2">
                          Bullet Points (one per line)
                        </label>
                        <textarea
                          value={exp.bullets.join('\n')}
                          onChange={(e) => updateExperienceBullets(exp.id, e.target.value)}
                          className="w-full bg-dark-200 rounded-xl min-h-36 p-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Developed a new feature that increased user engagement by 20%"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-primary-100">Skills</h2>
            
            <div>
              <label className="block text-light-100 mb-2">
                Enter your skills (separated by commas)
              </label>
              <textarea
                value={currentResume.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                className="w-full bg-dark-200 rounded-xl min-h-36 p-5 placeholder:text-light-400 text-light-100"
                placeholder="e.g., JavaScript, React, Node.js, Python, Project Management"
              />
              
              {currentResume.skills.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-light-100 mb-2">Current Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentResume.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-dark-200 rounded-full px-3 py-1 text-sm text-light-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-primary-100">Projects</h2>
              <button 
                onClick={addProject}
                className="btn-secondary-sm"
              >
                Add Project
              </button>
            </div>
            
            {currentResume.projects.length === 0 ? (
              <div className="text-center py-8 text-light-400">
                <p>No projects yet. Click &quot;Add Project&quot; to add your portfolio projects.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {currentResume.projects.map((proj) => (
                  <div key={proj.id} className="dark-gradient rounded-xl p-6 border border-white/10">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-semibold text-lg text-primary-100">Project Entry</h3>
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="text-destructive-100 hover:text-destructive-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <label className="block text-light-100 mb-2">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., E-commerce Platform"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">Project Link (Optional)</label>
                        <input
                          type="url"
                          value={proj.link || ''}
                          onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., https://github.com/yourproject"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">Start Date (Optional)</label>
                        <input
                          type="text"
                          value={proj.startDate || ''}
                          onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Jan 2022"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-light-100 mb-2">End Date (Optional)</label>
                        <input
                          type="text"
                          value={proj.endDate || ''}
                          onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Mar 2022 or Present"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-light-100 mb-2">
                          Technologies Used (separated by commas)
                        </label>
                        <input
                          type="text"
                          value={proj.technologies.join(', ')}
                          onChange={(e) => updateProjectTechnologies(proj.id, e.target.value)}
                          className="w-full bg-dark-200 rounded-full min-h-12 px-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., React, Node.js, MongoDB"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-light-100 mb-2">Project Description</label>
                        <textarea
                          value={proj.description}
                          onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                          className="w-full bg-dark-200 rounded-xl min-h-36 p-5 placeholder:text-light-400 text-light-100"
                          placeholder="e.g., Designed and developed a full-stack e-commerce platform with user authentication, product listings, and payment processing."
                        />
                      </div>
                      
                      {proj.technologies.length > 0 && (
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-medium text-light-100 mb-2">Technologies:</h4>
                          <div className="flex flex-wrap gap-2">
                            {proj.technologies.map((tech, index) => (
                              <span 
                                key={index}
                                className="bg-dark-200 rounded-full px-3 py-1 text-sm text-light-100"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom Action Buttons */}
      <div className="mt-8 flex justify-end gap-3">
        <button 
          onClick={goBack}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button 
          onClick={saveResume}
          className="btn-primary"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Resume'}
        </button>
      </div>
    </div>
  );
}