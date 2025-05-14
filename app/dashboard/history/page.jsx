"use client"
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { comparisons as comparisonsTable } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const [comparisons, setComparisons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComparisons = async () => {
      if (!user?.id) return;
      
      try {
        const result = await db
          .select({
            id: comparisonsTable.id,
            title: comparisonsTable.title,
            items: comparisonsTable.items,
            result: comparisonsTable.result,
            createdAt: comparisonsTable.createdAt
          })
          .from(comparisonsTable)
          .where(eq(comparisonsTable.userId, user.id))
          .orderBy(desc(comparisonsTable.createdAt));
        
        setComparisons(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Failed to fetch comparisons:", error);
        setComparisons([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (userLoaded && user?.id) {
      fetchComparisons();
    }
  }, [user?.id, userLoaded]);

  const handleDelete = async (id) => {
    try {
      setComparisons(prev => prev.filter(c => c.id !== id));
      await db
        .delete(comparisonsTable)
        .where(eq(comparisonsTable.id, id));
    } catch (error) {
      console.error("Failed to delete comparison:", error);
      const result = await db
        .select()
        .from(comparisonsTable)
        .where(eq(comparisonsTable.userId, user.id))
        .orderBy(desc(comparisonsTable.createdAt));
      setComparisons(Array.isArray(result) ? result : []);
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (!userLoaded || isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Comparison History</h1>
        <Button asChild>
          <Link href="/dashboard">New Comparison</Link>
        </Button>
      </div>
      
      {comparisons.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900">No comparisons yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Your comparison history will appear here once you start comparing items.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {comparisons.map((comp) => (
            <div key={comp.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{truncateText(comp.title, 60)}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(comp.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(comp.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {comp.items?.slice(0, 3).map((item, index) => (
                  <span key={index} className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    {truncateText(item, 20)}
                  </span>
                ))}
                {comp.items?.length > 3 && (
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    +{comp.items.length - 3} more
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <Button asChild size="sm" className="ml-auto bg-blue-600 hover:bg-blue-700">
                  <Link href={`/dashboard/results?id=${comp.id}`}>
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}