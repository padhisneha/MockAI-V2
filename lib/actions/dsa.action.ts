// lib/actions/dsa.action.ts
'use server';

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { DSAAttempt, DSAQuestion, Feedback } from "@/types";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getDSAQuestions(): Promise<DSAQuestion[] | null> {
  const questions = await db
    .collection('dsaQuestions')
    .orderBy('createdAt', 'desc')
    .get();

  return questions.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as DSAQuestion[];
}

export async function getDSAQuestionById(id: string): Promise<DSAQuestion | null> {
  const question = await db
    .collection('dsaQuestions')
    .doc(id)
    .get();

  if (!question.exists) return null;

  return {
    id: question.id,
    ...question.data()
  } as DSAQuestion;
}

export async function getUserDSAAttempts(userId: string): Promise<DSAAttempt[] | null> {
  const attempts = await db
    .collection('dsaAttempts')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return attempts.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as DSAAttempt[];
}

export async function saveDSAAttempt(params: {
  userId: string;
  questionId: string;
  code: string;
  status: 'completed' | 'failed' | 'in-progress';
}): Promise<{ success: boolean; attemptId?: string }> {
  try {
    const { userId, questionId, code, status } = params;
    
    const attempt = await db.collection('dsaAttempts').add({
      userId,
      questionId,
      code,
      status,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      attemptId: attempt.id
    };
  } catch (error) {
    console.error('Error saving DSA attempt', error);
    return { success: false };
  }
}

export async function getAttemptByUserAndQuestion(userId: string, questionId: string): Promise<DSAAttempt | null> {
  const attempts = await db
    .collection('dsaAttempts')
    .where('userId', '==', userId)
    .where('questionId', '==', questionId)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  if (attempts.empty) return null;

  const attemptDoc = attempts.docs[0];
  return {
    id: attemptDoc.id,
    ...attemptDoc.data()
  } as DSAAttempt;
}

export async function createDSAFeedback(params: {
  attemptId: string;
  code: string;
  questionId: string;
}): Promise<{ success: boolean; feedbackId?: string }> {
  try {
    const { attemptId, code, questionId } = params;
    
    // Get the question details
    const question = await getDSAQuestionById(questionId);
    if (!question) {
      return { success: false };
    }
    
    // Get the attempt to find the user
    const attempt = await db
      .collection('dsaAttempts')
      .doc(attemptId)
      .get();
    
    if (!attempt.exists) {
      return { success: false };
    }
    
    const attemptData = attempt.data() as DSAAttempt;
    const userId = attemptData.userId;
    
    // Format transcript for the feedback algorithm
    const transcript = [
      { role: 'system', content: `DSA Question: ${question.title} (${question.difficulty})` },
      { role: 'system', content: question.description },
      { role: 'user', content: code }
    ];
    
    const formattedTranscript = transcript
      .map((sentence) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");
    
    // Generate feedback using the AI model
    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI reviewer analyzing a coding solution. Your task is to evaluate the code based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        
        Question: ${question.title} (${question.difficulty})
        ${question.description}
        
        Submitted Code:
        ${code}
        
        Please score the solution from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Code clarity, comments, variable naming.
        - **Technical Knowledge**: Understanding of algorithms and data structures.
        - **Problem-Solving**: Approach to the problem, logic, and efficiency.
        - **Cultural & Role Fit**: Code style and conventions.
        - **Confidence & Clarity**: Solution completeness and correctness.
        `,
      system:
        "You are a professional code reviewer analyzing a DSA solution. Your task is to evaluate the code based on structured categories",
    });
    
    // Save feedback to the database
    const feedback = await db.collection("feedback").add({
      interviewId: attemptId, // Using attemptId as the interviewId to maintain consistency
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, feedbackId: feedback.id };
  } catch (error) {
    console.error("Error creating DSA feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(params: {
  interviewId: string;
  userId: string;
}): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '==', userId)
    .limit(1)
    .get();

  if(feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];

  return {
    id: feedbackDoc.id, 
    ...feedbackDoc.data()
  } as Feedback;
}

export async function getAttemptById(id: string): Promise<DSAAttempt | null> {
    try {
      const attempt = await db
        .collection('dsaAttempts')
        .doc(id)
        .get();
  
      if (!attempt.exists) return null;
  
      return {
        id: attempt.id,
        ...attempt.data()
      } as DSAAttempt;
    } catch (error) {
      console.error('Error getting DSA attempt:', error);
      return null;
    }
  }