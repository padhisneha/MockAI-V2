'use client';

import { User, Feedback } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { logout } from "@/lib/actions/auth.action";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "sonner";

interface ProfileProps {
  user: User;
  feedbacks: Feedback[];
}

interface ChartData {
  subject: string;
  score: number;
  fullMark: number;
}

export default function Profile({ user, feedbacks }: ProfileProps) {
  const router = useRouter();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [improvementAreas, setImprovementAreas] = useState<string[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (feedbacks && feedbacks.length > 0) {
      const categoryScores: Record<string, { total: number, count: number }> = {};
      const allAreasForImprovement: string[] = [];
      
      feedbacks.forEach(feedback => {
        feedback.categoryScores.forEach(category => {
          if (!categoryScores[category.name]) {
            categoryScores[category.name] = { total: 0, count: 0 };
          }
          categoryScores[category.name].total += category.score;
          categoryScores[category.name].count += 1;
        });
        
        if (feedback.areasForImprovement) {
          allAreasForImprovement.push(...feedback.areasForImprovement);
        }
      });
      
      const formattedData: ChartData[] = Object.entries(categoryScores).map(([name, { total, count }]) => ({
        subject: name,
        score: Math.round(total / count),
        fullMark: 100
      }));
      
      setChartData(formattedData);
      
      const improvementFrequency: Record<string, number> = {};
      allAreasForImprovement.forEach(area => {
        if (!improvementFrequency[area]) {
          improvementFrequency[area] = 0;
        }
        improvementFrequency[area] += 1;
      });
      
      const topImprovementAreas = Object.entries(improvementFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([area]) => area);
      
      setImprovementAreas(topImprovementAreas);
    } else {
      setChartData([
        { subject: "Communication Skills", score: 0, fullMark: 100 },
        { subject: "Technical Knowledge", score: 0, fullMark: 100 },
        { subject: "Problem Solving", score: 0, fullMark: 100 },
        { subject: "Cultural Fit", score: 0, fullMark: 100 },
        { subject: "Confidence and Clarity", score: 0, fullMark: 100 },
      ]);
    }
  }, [feedbacks]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      await logout();
      toast.success("Logged out successfully");
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full">
      {/* Profile Header - Glassmorphism Effect */}
      <div className="relative w-full mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-200/30 to-primary-100/20 rounded-3xl"></div>
        <div className="relative blue-gradient-dark rounded-3xl p-8 overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/10 rounded-full -mt-20 -mr-20 "></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-100/10 rounded-full -mb-20 -ml-20 "></div>
          
          <div className="flex items-center gap-8 z-10 relative">
            <div className="relative">
              <div className="absolute inset-0  rounded-full"></div>
              <div className="relative size-28 md:size-36 rounded-full border-2 border-white/20 overflow-hidden">
                <Image 
                  src="/user-avatar.png"
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-100">
                {user.name}
              </h1>
              <p className="text-light-400 text-lg mt-1">{user.email}</p>
              
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="btn-secondary flex items-center gap-2 group transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  {isLoggingOut ? "Logging out..." : "Sign Out"}
                </button>
                
                <button 
                  onClick={() => router.push('/interview')}
                  className="btn-primary flex items-center gap-2 group transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                    <polyline points="15 17 20 12 15 7"></polyline>
                    <path d="M4 12h16"></path>
                  </svg>
                  Start New Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="dark-gradient rounded-3xl p-8 border border-white/10 h-full">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
              <path d="M12 20v-6M6 20V10M18 20V4"></path>
            </svg>
            Interview Performance
            <span className="text-sm font-normal text-light-400 ml-auto">
              {feedbacks.length} {feedbacks.length === 1 ? 'interview' : 'interviews'}
            </span>
          </h2>
          
          {/* Original Pentagon Chart Style */}
          <div className="h-80 w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Improvement Areas */}
        <div className="dark-gradient rounded-3xl p-8 border border-white/10 h-full">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
              <path d="M2 12h5M16 12h7M6 12a4 4 0 0 0 8 0a4 4 0 0 0-8 0z"></path>
            </svg>
            Areas for Improvement
          </h2>
          
          {feedbacks.length > 0 ? (
            <div className="mt-6 space-y-6">
              {improvementAreas.map((area, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 size-4 rounded-full bg-primary-200/20 flex items-center justify-center">
                    <div className="size-2 rounded-full bg-primary-200"></div>
                  </div>
                  <p className="text-lg text-light-100">{area}</p>
                </div>
              ))}
              
              <div className="mt-12 blue-gradient-dark rounded-xl p-6 border border-primary-200/20">
                <h3 className="text-xl font-semibold mb-3 text-primary-100">How to Improve</h3>
                <p className="text-light-400">
                  Based on your {feedbacks.length} interview{feedbacks.length > 1 ? 's' : ''}, focus on improving your weakest areas shown in the chart. 
                  Continue practicing with more mock interviews to track your progress over time.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 blue-gradient-dark rounded-xl p-6 border border-primary-200/20">
              <div className="mb-6 flex justify-center">
                <div className="relative size-24 opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary-100">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                    <path d="M8 14h.01"></path>
                    <path d="M12 14h.01"></path>
                    <path d="M16 14h.01"></path>
                    <path d="M8 18h.01"></path>
                    <path d="M12 18h.01"></path>
                    <path d="M16 18h.01"></path>
                  </svg>
                  <div className="absolute -bottom-2 -right-2 size-10 flex items-center justify-center bg-primary-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-100">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-3 text-primary-100">No Interviews Yet</h3>
              <p className="text-light-400 text-center mb-6">
                You haven&apos;t completed any interviews yet. Start an interview to get personalized feedback on your performance.
              </p>
              
              <button 
                onClick={() => router.push('/interview')} 
                className="btn-primary w-full flex items-center justify-center gap-2 group"
              >
                Start Your First Interview
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Recent Activity */}
        {feedbacks.length > 0 && (
          <div className="dark-gradient rounded-3xl p-8 border border-white/10 lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Recent Activity
            </h2>
            
            <div className="space-y-6">
              {feedbacks.slice(0, 3).map((feedback, index) => (
                <div key={index} className="flex gap-6 items-start p-4 rounded-xl hover:bg-light-800/50 transition-colors cursor-pointer" onClick={() => router.push(`/interview/${feedback.interviewId}/feedback`)}>
                  <div className="size-12 rounded-full bg-primary-200/10 flex-shrink-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" x2="8" y1="13" y2="13"></line>
                      <line x1="16" x2="8" y1="17" y2="17"></line>
                      <line x1="10" x2="8" y1="9" y2="9"></line>
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Interview Feedback</h3>
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary-200"></div>
                        <span className="text-sm text-light-400">
                          {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-light-400 mt-1 line-clamp-2">{feedback.finalAssessment}</p>
                    
                    <div className="flex items-center mt-2 gap-4">
                      <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="text-primary-200 font-medium">{feedback.totalScore}</span>
                        <span className="text-light-400 text-sm">/100</span>
                      </div>
                      
                      <span className="text-sm text-light-400">
                        View details
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}