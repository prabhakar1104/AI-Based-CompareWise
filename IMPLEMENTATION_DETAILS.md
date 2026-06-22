# Multi-AI Implementation Reference

## Architecture Overview

```
User Request (compareItems)
         ↓
┌─────────────────────────────────────┐
│   Provider 1: Gemini (2-3 sec)      │ ← Tries first
│   model: gemini-2.5-flash           │
└─────────────────────────────────────┘
         ↓ (if fails)
┌─────────────────────────────────────┐
│   Provider 2: GROQ (3-4 sec)        │ ← Fallback 1
│   model: mixtral-8x7b-32768         │
└─────────────────────────────────────┘
         ↓ (if fails)
┌─────────────────────────────────────┐
│   Provider 3: OpenRouter (4-5 sec)  │ ← Fallback 2
│   model: mistralai/mistral-7b       │
└─────────────────────────────────────┘
         ↓ (if all fail)
    Error with details
```

## Core Functions

### 1. executeWithFallback()

Orchestrates the fallback logic:

```javascript
const executeWithFallback = async (callbackFunctions) => {
  const errors = [];

  for (let i = 0; i < callbackFunctions.length; i++) {
    try {
      const result = await callbackFunctions[i]();
      return result;  // Success! Return immediately
    } catch (error) {
      errors.push({ provider: i + 1, error: error.message });
      // Continue to next provider...
    }
  }

  // All failed - throw consolidated error
  throw new Error(`All providers failed: ${errors.join(...)}`);
};
```

### 2. callGroqAPI()

GROQ API integration:

```javascript
const callGroqAPI = async (prompt) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    },
  );

  const data = await response.json();
  return data.choices[0].message.content;
};
```

### 3. callOpenRouterAPI()

OpenRouter API integration:

```javascript
const callOpenRouterAPI = async (prompt) => {
  const response = await fetch(
    "https://openrouter.io/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    },
  );

  const data = await response.json();
  return data.choices[0].message.content;
};
```

## Usage in compareItems()

```javascript
export const compareItems = async (items) => {
  const prompt = `[comparison prompt]...`;

  const callProviders = [
    // Provider 1: Gemini
    async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent({...});
      return response.text();
    },

    // Provider 2: GROQ
    async () => {
      return await callGroqAPI(prompt);
    },

    // Provider 3: OpenRouter
    async () => {
      return await callOpenRouterAPI(prompt);
    }
  ];

  // Execute with automatic fallback
  const responseText = await executeWithFallback(callProviders);

  // Clean and parse JSON response
  return cleanAndParseJSON(responseText);
};
```

## Console Output Examples

### Successful Gemini Response

```
Attempting Gemini API...
Successfully used provider 1
```

### Fallback to GROQ

```
Attempting Gemini API...
Gemini API Error: Error: 429 Rate Limited
Provider 1 failed, trying next...
Switching to GROQ API...
Successfully used provider 2
```

### Full Fallback Chain

```
Attempting Gemini API...
Provider 1 failed, trying next...
Switching to GROQ API...
Provider 2 failed, trying next...
Switching to OpenRouter API...
Successfully used provider 3
```

### All Providers Failed

```
Attempting Gemini API...
Provider 1 failed: Invalid API key
Switching to GROQ API...
Provider 2 failed: Rate limit exceeded
Switching to OpenRouter API...
Provider 3 failed: Connection timeout
Error: All AI providers failed: Provider 1: Invalid API key | Provider 2: Rate limit exceeded | Provider 3: Connection timeout
```

## Error Handling Strategy

1. **Individual Provider Errors**: Logged and caught, system moves to next
2. **Rate Limiting**: Automatically uses another provider with capacity
3. **API Downtime**: Transparent fallback to working provider
4. **All Failures**: Consolidated error message shows what failed and why
5. **JSON Parsing**: Sophisticated repair logic handles response formatting

## Performance Characteristics

| Provider   | Speed  | Cost | Quality | Image Support |
| ---------- | ------ | ---- | ------- | ------------- |
| Gemini     | ⚡⚡⚡ | $$   | ⭐⭐⭐  | ✅            |
| GROQ       | ⚡⚡   | $    | ⭐⭐    | ❌            |
| OpenRouter | ⚡     | $    | ⭐⭐    | ❌            |

## Customization Options

### Change Provider Order

Edit the `callProviders` array in `compareItems()` function:

```javascript
const callProviders = [
  // Change order - GROQ first (not recommended)
  groqProvider,
  geminiProvider,
  openrouterProvider,
];
```

### Change Models

Update model names in API calls:

**GROQ Models**:

- mixtral-8x7b-32768 (current - best)
- gemma-7b-it
- llama2-70b-4096

**OpenRouter Models**:

- mistralai/mistral-7b-instruct (current)
- meta-llama/llama-2-70b-chat-hf
- nousresearch/nous-hermes-2-mixtral-8x7b-dpo

### Add Rate Limiting

Before implementing, consider adding delays:

```javascript
// Add small delay between retries
await new Promise((resolve) => setTimeout(resolve, 1000));
```

## Testing Checklist

- [ ] Verify API keys in `.env` are correct
- [ ] Test Gemini primary provider
- [ ] Test GROQ fallback (corrupt Gemini key)
- [ ] Test OpenRouter fallback (corrupt Gemini & GROQ keys)
- [ ] Check console logs for provider selection
- [ ] Verify JSON parsing for all providers
- [ ] Test error messages when all APIs fail
- [ ] Verify response time improvements

## Next Steps

1. Deploy to production
2. Monitor console logs in live environment
3. Track which provider is most reliable
4. Adjust rate limits if needed
5. Consider cost optimization based on usage patterns
