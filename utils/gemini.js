import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Function to extract text from images
export const extractTextFromImages = async (images) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const results = [];
    for (const image of images) {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { 
                text: "Extract all product information from this image. " +
                      "Include brand, model, specifications, features, and price if available. " +
                      "Format as a clear description suitable for product comparison."
              },
              { 
                inlineData: { 
                  mimeType: image.mimeType, 
                  data: image.data 
                } 
              }
            ]
          }
        ]
      });
      
      const response = await result.response;
      results.push(response.text());
    }
    
    return results;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("Failed to extract text from images");
  }
};

// Function to compare multiple items
// Enhanced compareItems function with better JSON handling
export const compareItems = async (items) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Compare these ${items.length} items... 
Important: Return ONLY valid JSON with ALL property names in double quotes,
NO trailing commas, and NO comments. The response must begin with { and end with } :

Items to compare:
${items.map((item, i) => `Item ${i+1}: ${item}`).join('\n')}

Required response format (return as valid JSON):
{
  "summary": "Brief overall comparison summary",
  "table": [
    "Feature | Item 1 | Item 2 | ...",
    "Specification 1 | Value 1 | Value 2 | ...",
    "..."
  ],
  "items": [
    {
      "name": "Item 1 Name",
      "pros": ["...", "..."],
      "cons": ["...", "..."],
      "bestFor": "Best use cases"
    },
    ...
  ],
  "recommendation": "Detailed recommendation with justification",
  "featureComparisons": {
    "Feature 1": {
      "winner": 0,
      "reason": "Explanation why this item is better or why they're equal"
    },
    ...
  }
}

Comparison guidelines:
1. Analyze all provided information carefully
2. Identify comparable features across all items
3. For each feature, determine which item is better or if they're equal
4. When items are equal in a feature, set "winner" to "both"
5. For quantitative comparisons:
   - Higher is better for: quality, capacity, performance, resolution, etc.
   - Lower is better for: price, weight, energy consumption, etc.
6. For qualitative comparisons, consider usefulness, durability, etc.
7. Include clear reasoning for each comparison
8. The final recommendation should consider all factors holistically
9. If items are in different categories, compare relevant aspects only
10. If an item is extracted from image data, use all available information to make the comparison

Important: Format the response as valid parseable JSON with all property names and string values in double quotes.`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const response = await result.response;
    const responseText = response.text();
    
    // First try with a more sophisticated JSON cleaning approach
    return cleanAndParseJSON(responseText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Error comparing items: " + error.message);
  }
};

/**
 * Enhanced JSON cleaning and parsing function
 */
function cleanAndParseJSON(text) {
  try {
    // Step 1: Try to find JSON content within code blocks if present
    let jsonString = text;
    
    // Extract content from code blocks if present
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      jsonString = codeBlockMatch[1].trim();
    }
    
    // Step 2: Try direct parsing first (maybe it's already valid)
    try {
      return JSON.parse(jsonString);
    } catch (initialError) {
      // Continue to cleaning steps if direct parsing fails
    }
    
    // Step 3: Pre-process the JSON string with comprehensive cleaning
    jsonString = jsonString
      // Remove potential markdown code block markers
      .replace(/```(?:json)?\s*/g, '')
      .replace(/\s*```\s*/g, '')
      .trim();
    
    // Step 4: Find the main JSON object (from first { to last })
    const jsonObjectMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      jsonString = jsonObjectMatch[0];
    }
    
    // Step 5: Apply advanced JSON formatting fixes
    jsonString = jsonString
      // Ensure property names have double quotes
      .replace(/(\{|\,)\s*([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":')
      
      // Replace single quotes with double quotes (but not in text that already has double quotes)
      .replace(/'([^']*?)'/g, '"$1"')
      
      // Fix trailing commas in objects and arrays
      .replace(/,(\s*[\}\]])/g, '$1')
      
      // Fix "winner": both (unquoted string values)
      .replace(/:\s*both\s*([,\}])/g, ':"both"$1')
      
      // Fix numeric-like strings that should be quoted
      .replace(/:\s*([^"{}\[\],\s][^,\}\]]*?)([,\}\]])/g, (match, value, terminator) => {
        // If value looks like a number, leave it unquoted
        if (/^-?\d+(\.\d+)?$/.test(value.trim())) {
          return ': ' + value.trim() + terminator;
        }
        // Otherwise, quote it
        return ':"' + value.trim() + '"' + terminator;
      });
    
    // Step 6: Try to parse the cleaned JSON
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Enhanced cleaning failed, trying iterative approach:", error);
      
      // Step 7: Last resort - attempt more aggressive JSON repair
      return repairAndParseJSON(jsonString, error);
    }
  } catch (finalError) {
    console.error("All JSON parsing attempts failed:", finalError);
    return {
      error: true,
      message: "Failed to parse comparison results after multiple attempts",
      parsingError: finalError.message,
      rawText: text
    };
  }
}

/**
 * Last-resort JSON repair function that attempts to fix specific issues
 * based on the error message
 */
function repairAndParseJSON(jsonString, previousError) {
  // Extract position information from error if available
  let errorPosition = -1;
  const positionMatch = previousError.message.match(/position (\d+)/);
  if (positionMatch) {
    errorPosition = parseInt(positionMatch[1]);
  }
  
  // Look at context around error if we have position information
  if (errorPosition >= 0) {
    const startPos = Math.max(0, errorPosition - 30);
    const endPos = Math.min(jsonString.length, errorPosition + 30);
    const errorContext = jsonString.substring(startPos, endPos);
    console.log(`Error context (around position ${errorPosition}):`, errorContext);
    
    // If error is about expecting a comma or closing brace, check for trailing commas
    if (previousError.message.includes("Expected ',' or '}'") || 
        previousError.message.includes("Expected ',' or ']'")) {
      
      // Fix specific trailing comma issues
      if (errorPosition < jsonString.length) {
        // Create a safe substring to manipulate
        let before = jsonString.substring(0, errorPosition);
        let after = jsonString.substring(errorPosition);
        
        // Add missing comma if needed
        if (!before.endsWith(',') && !after.startsWith(',') && 
            !before.trim().endsWith('{') && !before.trim().endsWith('[')) {
          jsonString = before + ',' + after;
        }
      }
    }
    
    // If error is about unexpected token, try to fix common issues
    if (previousError.message.includes("Unexpected token")) {
      // Try to identify and fix the specific character causing problems
      const problematicChar = jsonString.charAt(errorPosition);
      console.log(`Problematic character at position ${errorPosition}: "${problematicChar}"`);
      
      // Create a modified string removing or replacing the problematic character
      const modifiedString = 
        jsonString.substring(0, errorPosition) + 
        (problematicChar === "'" ? '"' : '') + 
        jsonString.substring(errorPosition + (problematicChar === "'" ? 1 : 0));
      
      try {
        return JSON.parse(modifiedString);
      } catch (err) {
        // Continue with other repair attempts
      }
    }
  }
  
  // Advanced regex-based repairs for common issues
  
  // Fix unquoted boolean values
  jsonString = jsonString
    .replace(/:\s*(true|false)([,\}\]])/gi, function(match, bool, terminator) {
      return ': ' + bool.toLowerCase() + terminator;
    });
  
  // Fix missing quotes around string values that follow a colon
  jsonString = jsonString.replace(
    /:\s*([^"{}\[\],\s][^,\}\]]*?)([,\}\]])/g, 
    function(match, value, terminator) {
      // Skip numbers, true, false, null
      if (/^-?\d+(\.\d+)?$/.test(value.trim()) || 
          /^(true|false|null)$/i.test(value.trim())) {
        return ': ' + value.trim() + terminator;
      }
      return ':"' + value.trim().replace(/"/g, '\\"') + '"' + terminator;
    }
  );
  
  // Final attempt
  try {
    return JSON.parse(jsonString);
  } catch (finalError) {
    // If all else fails, return a structured error response
    return {
      error: true,
      message: "All JSON parsing attempts failed",
      originalError: previousError.message,
      finalError: finalError.message,
      repairedJsonString: jsonString
    };
  }
}