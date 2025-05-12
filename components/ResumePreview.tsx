'use client';

import { Resume } from '@/types';

interface ResumePreviewProps {
  resume: Resume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    // Added white paper-like background container
    <div className="bg-gray-200 p-8 min-h-screen flex items-center justify-center">
      {/* A4 paper-like background with shadow */}
      <div className="bg-white text-dark-300 rounded-xl p-8 shadow-lg max-w-[850px] mx-auto w-full" style={{
        aspectRatio: '1 / 1.414', // A4 aspect ratio
        maxHeight: '1100px',
        overflow: 'auto'
      }}>
        {/* Header/Contact Information */}
        <div className="border-b-2 border-dark-200 pb-4 mb-6">
          <h1 className="text-3xl font-bold mb-3">{resume.personal.fullName}</h1>
          
          <div className="flex flex-wrap gap-3 text-sm">
            {resume.personal.email && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{resume.personal.email}</span>
              </div>
            )}
            
            {resume.personal.phone && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{resume.personal.phone}</span>
              </div>
            )}
            
            {resume.personal.location && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{resume.personal.location}</span>
              </div>
            )}
            
            {resume.personal.linkedin && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <a href={resume.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                  LinkedIn
                </a>
              </div>
            )}
            
            {resume.personal.github && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <a href={resume.personal.github} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                  GitHub
                </a>
              </div>
            )}
            
            {resume.personal.website && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
                <a href={resume.personal.website} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Professional Summary */}
        {resume.professionalSummary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-2 text-primary-600">Summary</h2>
            <p className="text-sm text-black">{resume.professionalSummary}</p>
          </div>
        )}
        
        {/* Experience */}
        {resume.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 text-primary-600">Experience</h2>
            
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold">{exp.position}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{exp.company}</div>
                    {exp.location && <div className="text-sm text-gray-600">{exp.location}</div>}
                  </div>
                  
                  {exp.description && <p className="text-sm mb-2 text-black">{exp.description}</p>}
                  
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-5 text-sm space-y-1 text-black">
                      {exp.bullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Education */}
        {resume.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 text-primary-600">Education</h2>
            
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold">{edu.institution}</h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</div>
                    {edu.location && <div className="text-sm text-gray-600">{edu.location}</div>}
                  </div>
                  
                  {edu.description && <p className="text-sm text-black">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects */}
        {resume.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 text-primary-600">Projects</h2>
            
            <div className="space-y-4">
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold">{proj.name}</h3>
                    {(proj.startDate || proj.endDate) && (
                      <span className="text-sm text-gray-600">
                        {proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}
                      </span>
                    )}
                  </div>
                  
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-500 hover:underline mb-1 block">
                      {proj.link}
                    </a>
                  )}
                  
                  {proj.description && <p className="text-sm mb-1 text-black py-1">{proj.description}</p>}
                  
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map((tech, index) => (
                        <span key={index} className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills */}
        {resume.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase mb-2 text-primary-600">Skills</h2>
            
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 rounded-full px-3 py-1 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}