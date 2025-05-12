'use server';

import { db } from "@/firebase/admin";
import { 
  CreateResumeParams, 
  UpdateResumeParams,
  DeleteResumeParams,
  GetResumeParams,
  Resume 
} from "@/types";
import { v4 as uuidv4 } from 'uuid';

export async function getResumesByUserId(userId: string): Promise<Resume[]> {
  try {
    const resumesSnapshot = await db
      .collection('resumes')
      .where('userId', '==', userId)
      .orderBy('updatedAt', 'desc')
      .get();
    
    if (resumesSnapshot.empty) {
      return [];
    }
    
    return resumesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Resume));
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
}

export async function getResumeById({ resumeId, userId }: GetResumeParams): Promise<Resume | null> {
  try {
    const resumeDoc = await db
      .collection('resumes')
      .doc(resumeId)
      .get();
    
    if (!resumeDoc.exists) {
      return null;
    }
    
    const resumeData = resumeDoc.data();
    
    // Security check - ensure the resume belongs to the requesting user
    if (resumeData?.userId !== userId) {
      return null;
    }
    
    return {
      id: resumeDoc.id,
      ...resumeData,
    } as Resume;
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
}

export async function createResume(params: CreateResumeParams): Promise<{ success: boolean; resumeId?: string; message?: string }> {
  const { userId, name } = params;
  
  try {
    // Create a new empty resume template
    const newResume: Omit<Resume, 'id'> = {
      userId,
      name,
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
      },
      professionalSummary: '',
      education: [],
      experience: [],
      skills: [],
      projects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const resumeRef = db.collection('resumes').doc();
    await resumeRef.set(newResume);
    
    return {
      success: true,
      resumeId: resumeRef.id
    };
  } catch (error) {
    console.error('Error creating resume:', error);
    return {
      success: false,
      message: 'Failed to create resume'
    };
  }
}

export async function updateResume(params: UpdateResumeParams): Promise<{ success: boolean; message?: string }> {
  const { resumeId, userId, data } = params;
  
  try {
    // First check if resume exists and belongs to user
    const resumeDoc = await db
      .collection('resumes')
      .doc(resumeId)
      .get();
    
    if (!resumeDoc.exists) {
      return {
        success: false,
        message: 'Resume not found'
      };
    }
    
    const resumeData = resumeDoc.data();
    if (resumeData?.userId !== userId) {
      return {
        success: false,
        message: 'Unauthorized to update this resume'
      };
    }
    
    // Add auto-generated IDs to new entries if needed
    if (data.education) {
      data.education = data.education.map(edu => ({
        ...edu,
        id: edu.id || uuidv4(),
      }));
    }
    
    if (data.experience) {
      data.experience = data.experience.map(exp => ({
        ...exp,
        id: exp.id || uuidv4(),
      }));
    }
    
    if (data.projects) {
      data.projects = data.projects.map(proj => ({
        ...proj,
        id: proj.id || uuidv4(),
      }));
    }
    
    // Update resume with new data and updatedAt timestamp
    await db
      .collection('resumes')
      .doc(resumeId)
      .update({
        ...data,
        updatedAt: new Date().toISOString()
      });
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating resume:', error);
    return {
      success: false,
      message: 'Failed to update resume'
    };
  }
}

export async function deleteResume(params: DeleteResumeParams): Promise<{ success: boolean; message?: string }> {
  const { resumeId, userId } = params;
  
  try {
    // First check if resume exists and belongs to user
    const resumeDoc = await db
      .collection('resumes')
      .doc(resumeId)
      .get();
    
    if (!resumeDoc.exists) {
      return {
        success: false,
        message: 'Resume not found'
      };
    }
    
    const resumeData = resumeDoc.data();
    if (resumeData?.userId !== userId) {
      return {
        success: false,
        message: 'Unauthorized to delete this resume'
      };
    }
    
    // Delete the resume
    await db
      .collection('resumes')
      .doc(resumeId)
      .delete();
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return {
      success: false,
      message: 'Failed to delete resume'
    };
  }
}