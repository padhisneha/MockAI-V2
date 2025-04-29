interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

interface DSAQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  starterCode: string;
  testCases: TestCase[];
  solution: string;
  createdAt: string;
}

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

interface DSAAttempt {
  id: string;
  userId: string;
  questionId: string;
  code: string;
  status: 'completed' | 'failed' | 'in-progress';
  createdAt: string;
}

// constants/index.ts (append to existing file)

// DSA difficulty mapping for colors and badges
export const difficultyMapping = {
  easy: {
    color: 'bg-green-100 text-green-800',
    label: 'Easy'
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Medium'
  },
  hard: {
    color: 'bg-red-100 text-red-800',
    label: 'Hard'
  }
};

// Common DSA tags for categorization
export const dsaTags = [
  'Array',
  'String',
  'Hash Table',
  'Dynamic Programming',
  'Math',
  'Sorting',
  'Greedy',
  'Depth-First Search',
  'Binary Search',
  'Tree',
  'Breadth-First Search',
  'Matrix',
  'Two Pointers',
  'Bit Manipulation',
  'Stack',
  'Queue',
  'Heap',
  'Graph',
  'Linked List',
  'Union Find',
  'Sliding Window',
  'Divide and Conquer',
  'Trie',
  'Recursion',
  'Binary Search Tree'
];


