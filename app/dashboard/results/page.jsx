"use client"
import { useEffect, useState, Suspense } from 'react';
import { useUser } from "@clerk/nextjs";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Share2, Award, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSearchParams } from "next/navigation";
import { db } from "@/utils/db";
import { comparisons as comparisonsTable } from "@/utils/schema";
import { eq } from "drizzle-orm";

// Helper function to parse table rows
const parseTableRow = (row) => {
  if (typeof row === 'string') {
    return row.split('|').filter(cell => cell.trim() !== '');
  }
  if (Array.isArray(row)) {
    return row;
  }
  return [];
};

function ResultContent(){
  const { user } = useUser();
  const searchParams = useSearchParams();
  const comparisonId = searchParams.get("id");
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [{ featureWinners, overallWinner, isTie, itemScores }, setAnalysis] = useState({ 
    featureWinners: {}, 
    overallWinner: null,
    isTie: false,
    itemScores: {}
  });
  const [activeFeature, setActiveFeature] = useState(null);

  // Analyze feature winners function
  const analyzeFeatureWinners = (table, items) => {
    if (!table || table.length === 0) return { featureWinners: {}, overallWinner: null, isTie: false, itemScores: {} };
    
    const featureWinners = {};
    const itemScores = {};
    
    // Initialize scores for all items
    items.forEach(item => {
      const itemName = typeof item === 'object' ? item.name : item;
      itemScores[itemName] = 0;
    });
    
    // Process each row in the table
    table.forEach(row => {
      const cells = parseTableRow(row);
      if (cells.length < 2) return;
      
      const featureName = cells[0].trim().toLowerCase();
      const values = cells.slice(1).map(cell => cell.trim());
      
      // Skip header rows or non-comparable features
      if (featureName.includes('feature') || 
          featureName.includes('name') || 
          featureName.includes('color')) return;
      
      // Try to extract numerical values
      const numericValues = values.map(value => {
        const numMatch = value.match(/(\d+\.?\d*)/);
        return numMatch ? parseFloat(numMatch[0]) : null;
      });
      
      // Compare values
      if (numericValues.every(v => v !== null)) {
        const maxValue = Math.max(...numericValues);
        const minValue = Math.min(...numericValues);
        
        const higherIsBetter = !['price', 'weight', 'cost', 'consumption'].some(term => 
          featureName.includes(term)
        );
        
        const bestValue = higherIsBetter ? maxValue : minValue;
        const bestIndices = numericValues
          .map((v, i) => v === bestValue ? i : null)
          .filter(i => i !== null);
        
        if (bestIndices.length === 1) {
          featureWinners[featureName] = bestIndices[0];
          const itemName = typeof items[bestIndices[0]] === 'object' ? 
            items[bestIndices[0]].name : 
            items[bestIndices[0]];
          itemScores[itemName]++;
        } else {
          featureWinners[featureName] = 'both';
          // Award half point to each item for ties
          bestIndices.forEach(index => {
            const itemName = typeof items[index] === 'object' ? 
              items[index].name : 
              items[index];
            itemScores[itemName] += 0.5;
          });
        }
      } else {
        // For non-numeric comparisons
        const uniqueValues = new Set(values);
        if (uniqueValues.size === 1) {
          featureWinners[featureName] = 'both';
        } else {
          // Give point to the item with more detailed specification
          const bestIndex = values.reduce((best, curr, idx) => 
            curr.length > values[best].length ? idx : best, 0);
          featureWinners[featureName] = bestIndex;
          const itemName = typeof items[bestIndex] === 'object' ? 
            items[bestIndex].name : 
            items[bestIndex];
          itemScores[itemName]++;
        }
      }
    });
    
    // Determine overall winner
    const maxScore = Math.max(...Object.values(itemScores));
    const winners = Object.entries(itemScores)
      .filter(([_, score]) => score === maxScore)
      .map(([name]) => name);
    
    return {
      featureWinners,
      overallWinner: winners.length === 1 ? winners[0] : null,
      isTie: winners.length > 1,
      itemScores
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (comparisonId) {
          const result = await db
            .select()
            .from(comparisonsTable)
            .where(eq(comparisonsTable.id, parseInt(comparisonId)))
            .limit(1);

          if (result && result[0]) {
            setComparisonData(result[0].result);
            const analysis = analyzeFeatureWinners(result[0].result.table, result[0].result.items);
            setAnalysis(analysis);
          }
        } else {
          const data = sessionStorage.getItem('comparisonResult');
          if (data) {
            const parsedData = JSON.parse(data);
            setComparisonData(parsedData);
            const analysis = analyzeFeatureWinners(parsedData.table, parsedData.items);
            setAnalysis(analysis);
          }
        }
      } catch (error) {
        console.error("Error loading comparison data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [comparisonId]);

  const handleDownload = () => {
    if (!comparisonData) return;
    
    let csvContent = "Feature," + comparisonData.items.map(item => `"${item.name}"`).join(",") + "\n";
    
    if (comparisonData.table) {
      comparisonData.table.forEach(row => {
        const cells = parseTableRow(row);
        csvContent += cells.map(cell => `"${cell.trim()}"`).join(",") + "\n";
      });
    }
    
    csvContent += "\nPros and Cons\n";
    comparisonData.items.forEach(item => {
      csvContent += `"${item.name} Pros",${item.pros.map(pro => `"${pro}"`).join(",")}\n`;
      csvContent += `"${item.name} Cons",${item.cons.map(con => `"${con}"`).join(",")}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparison-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Product Comparison Results',
        text: `Comparison between ${comparisonData.items.map(i => i.name).join(' vs ')}`,
        url: window.location.href,
      });
    } catch (err) {
      console.error('Error sharing:', err);
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!comparisonData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">No Comparison Data Found</h1>
        <Button asChild>
          <a href="/dashboard">Back to Comparison Tool</a>
        </Button>
      </div>
    );
  }

  // Organize features into categories for better display
  const organizeFeatures = () => {
    if (!comparisonData.table) return {};
    const categories = {};
    const defaultCategory = "General Specifications";
    
    comparisonData.table.forEach(row => {
      const cells = parseTableRow(row);
      if (cells.length < 2) return;
      
      const featureName = cells[0].trim();
      
      // Try to determine category from feature name
      let category = defaultCategory;
      if (featureName.toLowerCase().includes('price') || 
          featureName.toLowerCase().includes('cost')) {
        category = "Price & Value";
      } else if (featureName.toLowerCase().includes('dimension') || 
                featureName.toLowerCase().includes('size') || 
                featureName.toLowerCase().includes('weight')) {
        category = "Physical Specifications";
      } else if (featureName.toLowerCase().includes('battery') || 
                featureName.toLowerCase().includes('power')) {
        category = "Power & Battery";
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push(row);
    });
    
    return categories;
  };
  
  const featureCategories = organizeFeatures();

  // Calculate completion percentage for each item based on feature wins
  const calculateScorePercentage = (itemName) => {
    const totalFeatures = Object.keys(featureWinners).length;
    if (totalFeatures === 0) return 0;
    return Math.round((itemScores[itemName] / totalFeatures) * 100);
  };

  // Generate color class based on score percentage
  const getScoreColorClass = (percentage) => {
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <a href="/dashboard" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </a>
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Comparison Results</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Section */}
        <section className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Comparison Summary</h2>
          <p className="text-gray-700 mb-6">{comparisonData.summary}</p>
          
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {comparisonData.items.map((item, idx) => {
              const scorePercentage = calculateScorePercentage(item.name);
              const scoreColorClass = getScoreColorClass(scorePercentage);
              const isWinner = overallWinner === item.name;
              
              return (
                <div 
                  key={idx} 
                  className={`border rounded-lg p-4 ${isWinner ? 'border-green-500 bg-green-50' : 'border-gray-200'} relative`}
                >
                  {isWinner && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                      BEST CHOICE
                    </div>
                  )}
                  
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${scoreColorClass}`} 
                        style={{ width: `${scorePercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{scorePercentage}%</span>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" /> {item.pros.length} Pros
                    </div>
                    <div className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded flex items-center">
                      <ThumbsDown className="h-3 w-3 mr-1" /> {item.cons.length} Cons
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {overallWinner && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex items-center">
                <Award className="h-6 w-6 text-green-600 mr-2" />
                <div>
                  <h3 className="font-bold text-lg text-green-800">Overall Best</h3>
                  <p className="text-green-700">
                    <span className="font-semibold">{overallWinner}</span> - Wins in most categories
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isTie && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-center">
                <Award className="h-6 w-6 text-blue-600 mr-2" />
                <div>
                  <h3 className="font-bold text-lg text-blue-800">Close Competition</h3>
                  <p className="text-blue-700">
                    The products are evenly matched. Choose based on your specific needs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Feature by Feature Comparison Section */}
        {comparisonData.table && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Feature by Feature Comparison</h2>
            
            {/* Feature Tabs */}
            <div className="mb-6 bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap gap-2">
                {Object.keys(featureCategories).map((category, idx) => (
                  <Button 
                    key={idx}
                    variant={activeFeature === category ? "default" : "outline"}
                    onClick={() => setActiveFeature(category)}
                    className="mb-2"
                  >
                    {category}
                  </Button>
                ))}
                {activeFeature === null && setActiveFeature(Object.keys(featureCategories)[0])}
              </div>
            </div>
            
            {/* Feature Cards */}
            <div className="space-y-4">
              {activeFeature && featureCategories[activeFeature]?.map((row, rowIdx) => {
                const cells = parseTableRow(row);
                if (cells.length < 2) return null;
                
                const featureName = cells[0].trim();
                const featureNameLower = featureName.toLowerCase();
                const featureWinner = featureWinners[featureNameLower];
                
                return (
                  <div key={rowIdx} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <h3 className="font-medium text-gray-900">{featureName}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {cells.slice(1).map((cell, cellIdx) => {
                        const isWinner = featureWinner === cellIdx;
                        const isTie = featureWinner === 'both';
                        const itemName = comparisonData.items[cellIdx]?.name || `Item ${cellIdx + 1}`;
                        
                        return (
                          <div 
                            key={cellIdx}
                            className={`p-3 border rounded-lg ${
                              isWinner && !isTie ? 'border-green-500 bg-green-50' : 
                              isTie ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-700">{itemName}</h4>
                              {isWinner && !isTie && (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Best
                                </span>
                              )}
                              {isTie && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  Equal
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">{cell.trim()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        
        {/* Traditional Comparison Table (Condensed View) */}
        <section className="mb-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold mb-2">Specifications Table</h2>
            <p className="text-sm text-gray-500">
              Complete comparison in table format
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Feature
                  </th>
                  {comparisonData.items.map((item, i) => (
                    <th key={i} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonData.table.map((row, i) => {
                  const cells = parseTableRow(row);
                  const featureName = cells[0].trim().toLowerCase();
                  const featureWinner = featureWinners[featureName];
                  
                  return (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {cells[0].trim()}
                      </td>
                      {cells.slice(1).map((cell, j) => {
                        const isWinner = featureWinner === j || featureWinner === 'both';
                        const isBothWinner = featureWinner === 'both';
                        
                        return (
                          <td 
                            key={j} 
                            className={`px-6 py-4 text-gray-500 ${
                              isWinner ? (isBothWinner ? 'bg-blue-50' : 'bg-green-50') : ''
                            }`}
                          >
                            <div className="flex items-center">
                              {cell.trim()}
                              {isWinner && (
                                <CheckCircle className={`ml-2 h-4 w-4 ${
                                  isBothWinner ? 'text-blue-500' : 'text-green-500'
                                } flex-shrink-0`} />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pros and Cons Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pros and Cons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonData.items.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-green-700 font-medium mb-2 flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2" /> Pros
                    </h4>
                    <ul className="space-y-1 text-gray-600">
                      {item.pros.map((pro, proIdx) => (
                        <li key={proIdx} className="flex items-start">
                          <span className="text-green-500 mr-2">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-red-700 font-medium mb-2 flex items-center">
                      <ThumbsDown className="h-4 w-4 mr-2" /> Cons
                    </h4>
                    <ul className="space-y-1 text-gray-600">
                      {item.cons.map((con, conIdx) => (
                        <li key={conIdx} className="flex items-start">
                          <span className="text-red-500 mr-2">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {comparisonData.recommendation && (
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Final Recommendation</h2>
            <div className="prose max-w-none text-gray-700">
              <p>{comparisonData.recommendation}</p>
              
              {overallWinner ? (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-green-800">Our Verdict</h3>
                    <p className="text-green-700">
                      Based on feature comparisons, <span className="font-semibold">{overallWinner}</span> emerges as the best choice.
                    </p>
                  </div>
                </div>
              ) : isTie ? (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-blue-800">Close Competition</h3>
                    <p className="text-blue-700">
                      The products are very evenly matched. Choose based on your specific needs.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}

        <div className="flex justify-center mt-8">
          <Button asChild>
            <a href="/dashboard" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" /> Compare again
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}