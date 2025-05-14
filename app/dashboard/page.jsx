"use client"
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db } from "@/utils/db";
import { users, comparisons } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Image, Trash2, X } from 'lucide-react';
import { compareItems, extractTextFromImages } from '@/utils/gemini';
import Link from 'next/link';
import { History } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const fileInputRef = useRef(null);
  const [items, setItems] = useState(['', '']);
  const [imageUploads, setImageUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUploads = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImageUploads([...imageUploads, ...newUploads]);
  };

  const removeImage = (index) => {
    setImageUploads(prev => {
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const addItemField = () => {
    setItems([...items, '']);
  };

  const removeItemField = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Modified handleCompare function to process both text and images
  const handleCompare = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Filter out empty text fields
      const validTextItems = items.filter(item => item.trim() !== '');
      
      // Process image uploads if there are any
      let extractedImageItems = [];
      if (imageUploads.length > 0) {
        const imagePromises = imageUploads.map(async (imgUpload) => {
          // Convert image file to base64 for API
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64String = reader.result.split(',')[1];
              resolve({
                data: base64String,
                mimeType: imgUpload.file.type
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(imgUpload.file);
          });
        });
        
        // Wait for all images to be processed to base64
        const processedImages = await Promise.all(imagePromises);
        
        // Extract text from images using Gemini Vision API
        extractedImageItems = await extractTextFromImages(processedImages);
      }
      
      // Combine text items and extracted image items
      const allValidItems = [...validTextItems, ...extractedImageItems];
      
      // Check if we have at least two items to compare
      if (allValidItems.length < 2) {
        throw new Error("Please provide at least 2 items (text or images) to compare");
      }
      
      // Send to Gemini for comparison
      const result = await compareItems(allValidItems);
      
      // Check if result is raw text that needs parsing
      if (result.raw) {
        // Handle raw text response
        const parsedResult = {
          items: allValidItems.map(name => ({ name, pros: [], cons: [] })),
          summary: '',
          table: [],
          recommendation: '',
          winner: null
        };

        const lines = result.text.split('\n').filter(line => line.trim() !== '');
        
        // Extract summary (first few lines before first section)
        let summaryEnd = lines.findIndex(line => 
          line.toLowerCase().includes('key specifications') || 
          line.toLowerCase().includes('pros and cons') ||
          line.toLowerCase().includes('comparison table')
        );
        
        parsedResult.summary = summaryEnd === -1 ? 
          lines.slice(0, 3).join(' ') : 
          lines.slice(0, summaryEnd).join(' ');
        
        // Extract comparison table if exists
        const tableStart = lines.findIndex(line => 
          line.toLowerCase().includes('key specifications') || 
          line.toLowerCase().includes('comparison table')
        );
        
        if (tableStart !== -1) {
          const tableEnd = lines.slice(tableStart + 1).findIndex(line => 
            line.trim() === '' || 
            line.toLowerCase().includes('pros and cons') ||
            line.toLowerCase().includes('best use cases')
          );
          
          parsedResult.table = tableEnd === -1 ? 
            lines.slice(tableStart + 1) : 
            lines.slice(tableStart + 1, tableStart + 1 + tableEnd);
        }
        
        // Extract pros and cons for each item
        let currentItemIndex = -1;
        let currentCategory = null;
        
        for (const line of lines) {
          const lowerLine = line.toLowerCase();
          
          // Check if we're starting a new item section
          const itemIndex = allValidItems.findIndex(name => 
            lowerLine.includes(name.toLowerCase())
          );
          
          if (itemIndex !== -1) {
            currentItemIndex = itemIndex;
            if (lowerLine.includes('pros')) currentCategory = 'pros';
            else if (lowerLine.includes('cons')) currentCategory = 'cons';
            continue;
          }
          
          // Check for category changes
          if (lowerLine.includes('pros')) {
            currentCategory = 'pros';
            continue;
          } else if (lowerLine.includes('cons')) {
            currentCategory = 'cons';
            continue;
          }
          
          // Add points to the appropriate category
          if (currentItemIndex !== -1 && currentCategory && 
              (line.includes('-') || line.includes('•') || /^\d+\./.test(line))) {
            const point = line.replace(/^[-•*]\s*/, '').trim();
            if (point) {
              if (currentCategory === 'pros') {
                parsedResult.items[currentItemIndex].pros.push(point);
              } else {
                parsedResult.items[currentItemIndex].cons.push(point);
              }
            }
          }
        }
        
        // Find the recommendation
        const recIndex = lines.findIndex(line => 
          line.toLowerCase().includes('recommendation') ||
          line.toLowerCase().includes('best choice') ||
          line.toLowerCase().includes('winner')
        );
        
        if (recIndex !== -1) {
          parsedResult.recommendation = lines.slice(recIndex, recIndex + 5).join(' ');
          
          // Try to determine the winner
          for (const name of allValidItems) {
            if (parsedResult.recommendation.toLowerCase().includes(name.toLowerCase())) {
              parsedResult.winner = name;
              break;
            }
          }
        }
        
        return processResult(parsedResult, allValidItems);
      }
      
      // Result is already JSON formatted from the API
      return processResult(result, allValidItems);
    } catch (error) {
      setError(error.message || "Sorry, we couldn't complete the comparison");
    } finally {
      setIsLoading(false);
    }
  };

  const processResult = async (parsedResult, validItems) => {
    if (user?.id) {
      // First ensure user exists
      await db.insert(users).values({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName
      }).onConflictDoNothing();
      
      // Then store the comparison
      await db.insert(comparisons).values({
        userId: user.id,
        title: `Comparison of ${validItems.slice(0, 2).join(' vs ')}${validItems.length > 2 ? ' and more' : ''}`,
        items: validItems,
        result: parsedResult
      });
    }

    // Store in session and navigate
    sessionStorage.setItem('comparisonResult', JSON.stringify(parsedResult));
    router.push('/dashboard/results');
  };

  // Calculate total valid items (text inputs + images)
  const validItemCount = items.filter(i => i.trim() !== '').length + imageUploads.length;
 return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Product Comparison Tool
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Compare products side-by-side using AI to get personalized recommendations
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            View History
          </Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="space-y-4 mb-6">
          {/* Item input fields */}
          {items.map((item, index) => (
            <div key={index} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item {index + 1}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g. ${index % 2 === 0 ? 'iPhone 15' : 'Samsung Galaxy S23'}`}
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {items.length > 2 && (
                  <button
                    onClick={() => removeItemField(index)}
                    className="p-3 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              onClick={addItemField}
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" /> Add Another Item
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <Image className="h-4 w-4" /> Upload Images
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
              disabled={isLoading}
            />
          </div>
        </div>
        
        {/* Image preview */}
        {imageUploads.length > 0 && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-3">Uploaded Images ({imageUploads.length})</h3>
            
            <div className="flex flex-wrap gap-3 mb-3">
              {imageUploads.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img.preview} 
                    alt={`Uploaded ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500">
              These images will be automatically processed when you click "Compare Now"
            </p>
          </div>
        )}
        
        <Button 
          onClick={handleCompare}
          className="w-full py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={validItemCount < 2 || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">🌀</span>
              Comparing...
            </span>
          ) : (
            'Compare Now'
          )}
        </Button>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}