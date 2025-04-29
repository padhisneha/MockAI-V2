// app/(root)/dsa/[id]/feedback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDSAQuestionById, getFeedbackByInterviewId, getAttemptById } from '@/lib/actions/dsa.action';
import { DSAAttempt, DSAQuestion, Feedback } from '@/types';
import Image from 'next/image';
import dayjs from 'dayjs';
import { getCurrentUser } from '@/lib/actions/auth.action';

export default function DSAFeedbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [question, setQuestion] = useState<DSAQuestion | null>(null);
  const [attempt, setAttempt] = useState<DSAAttempt | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!attemptId) {
        setError('No attempt ID provided');
        setLoading(false);
        return;
      }

      try {
        // Get current user
        const userData = await getCurrentUser();
        setUser(userData);

        if (!userData) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Use server actions instead of direct Firestore access
        const [attemptData, questionData, feedbackData] = await Promise.all([
          // We need to add this function to dsa.action.ts
          getAttemptById(attemptId),
          getDSAQuestionById(params.id as string),
          getFeedbackByInterviewId({
            interviewId: attemptId,
            userId: userData.id
          })
        ]);

        if (!attemptData) {
          setError('Attempt not found');
          setLoading(false);
          return;
        }

        setAttempt(attemptData);
        setQuestion(questionData);
        setFeedback(feedbackData);
      } catch (err) {
        setError('Failed to load feedback');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [attemptId, params.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading feedback...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  if (!question || !attempt) {
    return <div className="text-center py-10">Question or attempt data not found</div>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {question.title} - Feedback
        </h1>
        <span className={`text-sm px-3 py-1 rounded-full ${
          question.difficulty === 'easy' 
            ? 'bg-green-100 text-green-800' 
            : question.difficulty === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
        }`}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5">
          {/* Overall Score */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Score:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore ?? 'N/A'}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      {feedback ? (
        <>
          <p className="text-lg">{feedback.finalAssessment}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Your Solution Panel */}
            <div className="border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Your Solution</h2>
              <pre className="bg-gray-700 p-4 rounded-md overflow-auto max-h-[400px]">
                <code>{attempt.code}</code>
              </pre>
            </div>

            {/* Breakdown of Scores Panel */}
            <div className="border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Breakdown of Scores</h2>
              <div className="space-y-4">
                {feedback.categoryScores?.map((category, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold">{category.name}</p>
                      <span className="text-primary-200 font-bold">{category.score}/100</span>
                    </div>
                    <p className="text-gray-400">{category.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths Panel */}
            <div className="border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Strengths</h2>
              <ul className="list-disc pl-5 space-y-2">
                {feedback.strengths?.map((strength, index) => (
                  <li key={index} className="text-gray-400">{strength}</li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement Panel */}
            <div className="border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Areas for Improvement</h2>
              <ul className="list-disc pl-5 space-y-2">
                {feedback.areasForImprovement?.map((area, index) => (
                  <li key={index} className="text-gray-400">{area}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No feedback available for this attempt yet.
        </div>
      )}

      {/* Example Solution */}
      <div className="border border-gray-200 rounded-lg shadow-sm p-6 mt-4">
        <h2 className="text-xl font-semibold mb-4">Example Solution</h2>
        <pre className="bg-gray-700 p-4 rounded-md overflow-auto max-h-[400px]">
          <code>{question.solution}</code>
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <Button asChild className="btn-secondary">
          <Link href="/dsa">Back to Questions</Link>
        </Button>
        <Button asChild className="btn-primary">
          <Link href={`/dsa/${question.id}`}>Try Again</Link>
        </Button>
      </div>
    </section>
  );
}