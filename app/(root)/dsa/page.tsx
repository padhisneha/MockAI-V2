// app/(root)/dsa/page.tsx
import Link from 'next/link';
import { getDSAQuestions } from '@/lib/actions/dsa.action';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getUserDSAAttempts } from '@/lib/actions/dsa.action';

export default async function DSAPage() {
  const user = await getCurrentUser();
  const questions = await getDSAQuestions();
  const attempts = user ? await getUserDSAAttempts(user.id) : null;

  // Create a map of completed questions
  const completedQuestions = new Map();
  if (attempts) {
    attempts.forEach(attempt => {
      if (attempt.status === 'completed') {
        completedQuestions.set(attempt.questionId, attempt);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">DSA Practice Questions</h1>
      <p className="text-gray-600">
        Practice data structures and algorithms questions to prepare for technical interviews.
      </p>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {questions && questions.length > 0 ? (
          questions.map((question) => {
            const isCompleted = completedQuestions.has(question.id);
            
            return (
              <Link 
                href={`/dsa/${question.id}`} 
                key={question.id}
                className="block"
              >
                <div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{question.title}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      question.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-800' 
                        : question.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {isCompleted && (
                    <div className="flex items-center text-green-600">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-1" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span className="text-sm font-medium">Completed</span>
                      <span className="ml-auto text-sm underline">View Feedback</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">No DSA questions available.</p>
        )}
      </div>
    </div>
  );
}