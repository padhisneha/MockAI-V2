"use client";

import { User, Feedback } from "@/types";
import Image from "next/image";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

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

  useEffect(() => {
    if (feedbacks && feedbacks.length > 0) {
      // Process feedback data for the radar chart
      const categoryScores: Record<string, { total: number, count: number }> = {};
      const allAreasForImprovement: string[] = [];
      
      // Collect all category scores and areas for improvement
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
      
      // Calculate average scores for each category
      const formattedData: ChartData[] = Object.entries(categoryScores).map(([name, { total, count }]) => ({
        subject: name,
        score: Math.round(total / count), // Calculate average (already out of 100)
        fullMark: 100
      }));
      
      setChartData(formattedData);
      
      // Find most common areas for improvement
      const improvementFrequency: Record<string, number> = {};
      allAreasForImprovement.forEach(area => {
        if (!improvementFrequency[area]) {
          improvementFrequency[area] = 0;
        }
        improvementFrequency[area] += 1;
      });
      
      // Get top 3 most common areas for improvement
      const topImprovementAreas = Object.entries(improvementFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([area]) => area);
      
      setImprovementAreas(topImprovementAreas);
    } else {
      // Default chart data when no feedbacks available
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
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      {/* User Information Card */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36 mb-6">
            <Image 
              src="/user-avatar.png" 
              alt={user.name} 
              fill
              className="rounded-full object-cover border-2 border-purple-200"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{user.email}</p>
          <Button 
            onClick={handleLogout} 
            variant="destructive" 
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Performance Radar Chart */}
      <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Interview Performance</h3>
        
        <div className="h-72 w-full">
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
        
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Areas for Improvement</h4>
          
          {feedbacks.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {improvementAreas.map((area, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md p-4">
              <p className="text-gray-700 dark:text-gray-300">
                You haven&apost completed any interviews yet. Start an interview to get personalized feedback on your performance.
              </p>
              <Button onClick={() => router.push('/interview')} className="mt-4">
                Start an Interview
              </Button>
            </div>
          )}
          
          {feedbacks.length > 0 && (
            <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 rounded-md p-4">
              <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">How to Improve</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Based on your {feedbacks.length} interview{feedbacks.length > 1 ? 's' : ''}, focus on improving your weakest areas shown in the chart. 
                Continue practicing with more mock interviews to track your progress over time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}