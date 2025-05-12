// app/(root)/dsa/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDSAQuestionById, saveDSAAttempt, createDSAFeedback } from '@/lib/actions/dsa.action';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { Button } from '@/components/ui/button';
import Editor from '@monaco-editor/react';
import { DSAQuestion } from '@/types';
import DSAAgent from '@/components/DSAAgent';

export default function DSAQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<DSAQuestion | null>(null);
  const [user, setUser] = useState<any>(null);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionData, userData] = await Promise.all([
          getDSAQuestionById(params.id as string),
          getCurrentUser()
        ]);
        setQuestion(questionData);
        setUser(userData);
        if (questionData) {
          setCode(questionData.starterCode);
        }
      } catch (err) {
        setError('Failed to load question');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleSubmit = async () => {
    if (!user || !question) return;
    
    setSubmitting(true);
    try {
      // Save the attempt
      const result = await saveDSAAttempt({
        userId: user.id,
        questionId: question.id,
        code,
        status: 'in-progress'
      });

      if (result.success && result.attemptId) {
        // Generate feedback
        const feedbackResult = await createDSAFeedback({
          attemptId: result.attemptId,
          code,
          questionId: question.id
        });

        if (feedbackResult.success) {
          // Navigate to feedback page
          router.push(`/dsa/${question.id}/feedback?attemptId=${result.attemptId}`);
        } else {
          setError('Failed to generate feedback');
        }
      } else {
        setError('Failed to submit code');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (error || !question) {
    return <div className="text-red-500 text-center py-10">{error || 'Question not found'}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{question.title}</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Code Editor - Takes 3/5 of the space */}
        <div className="lg:col-span-3 border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-xl font-semibold mb-4">Code Editor</h2>
          <div className="h-[500px] rounded-md overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={submitting} 
              className="btn-primary"
            >
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </Button>
          </div>
        </div>

        {/* Right panel with Interview Call and Problem Description - Takes 2/5 of the space */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Interview Call Section using DSAAgent */}
          <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-gray-700">
            {user && question && (
              <DSAAgent
                userName={user.name || 'User'}
                userId={user.id}
                questionTitle={question.title}
                questionDifficulty={question.difficulty}
                questionId={question.id}
              />
            )}
          </div>

          {/* Problem Description */}
          <div className="border border-gray-200 rounded-lg shadow-sm p-4 flex-grow overflow-auto max-h-[500px]">
            <h2 className="text-xl font-semibold mb-2">Problem</h2>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: question.description }} />
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Example Test Cases:</h3>
              <div className="space-y-2">
                {question.testCases.map((testCase, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-md">
                    <p className="font-medium">Input: <code>{testCase.input}</code></p>
                    <p className="font-medium">Output: <code>{testCase.output}</code></p>
                    {testCase.explanation && (
                      <p className="text-sm text-gray-100 mt-1">Explanation: {testCase.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}