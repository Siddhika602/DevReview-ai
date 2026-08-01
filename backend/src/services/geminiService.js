import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'placeholder' || apiKey.trim() === '') {
    console.warn('WARNING: GEMINI_API_KEY is not configured or is a placeholder. Using mock AI responses.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export const reviewCodeWithGemini = async (code, language) => {
  const genAI = initializeGemini();

  if (!genAI) {
    return getMockReview(code, language);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', // Fallback to 1.5-flash for maximum stability, or 2.5-flash if preferred. Both support JSON mode.
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
You are an expert AI Code Reviewer. Analyze the following code.
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

You must perform a detailed audit and return a JSON object with the exact format below.
All your explanations in the JSON properties MUST be formatted as valid GitHub Markdown. Use bullet points, bold text, and code snippets inside the markdown where appropriate to make it visually engaging and readable.

Ensure you evaluate the code thoroughly in these six categories:
1. Bugs (Syntax errors, logical issues, runtime errors, edge cases, off-by-one errors)
2. Security (Injection vulnerabilities, resource leaks, credential exposure, unsafe functions, authorization checks)
3. Performance (Big-O complexity, memory consumption, caching, database queries, redundant checks)
4. Readability (Variable/function naming, spacing, structure, indentation, complexity)
5. Best Practices (Language idioms, structural design, proper standard library usage, modern features)
6. Suggested Improvements (Refactoring tips, architecture enhancements, modernization)

For each category, you must provide:
- "rating": One of "Good", "Needs Improvement", or "Critical".
- "content": Detailed markdown review specifying what is wrong and how to fix it, or why it is good.

You must return a JSON response matching the following schema:
{
  "title": "A short, descriptive, 3-5 word summary of what the code does or its main focus",
  "score": 85, // Integer from 0 to 100 assessing the overall code quality
  "summary": "A 2-3 sentence high-level summary of the code and the main takeaways from the review.",
  "categories": {
    "bugs": { "rating": "Good|Needs Improvement|Critical", "content": "Markdown content here" },
    "security": { "rating": "Good|Needs Improvement|Critical", "content": "Markdown content here" },
    "performance": { "rating": "Good|Needs Improvement|Critical", "content": "Markdown content here" },
    "readability": { "rating": "Good|Needs Improvement|Critical", "content": "Markdown content here" },
    "bestPractices": { "rating": "Good|Needs Improvement|Critical", "content": "Markdown content here" },
    "suggestedImprovements": { "rating": "Good|Needs Improvement|Critical", "content": "Markdown content here" }
  },
  "refactoredCode": "The complete, optimized, refactored version of the code resolving the issues found. Do NOT wrap this field in markdown block ticks in JSON - just return the raw string."
}
`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    // Parse response
    const reviewData = JSON.parse(textResponse);
    return reviewData;
  } catch (error) {
    console.error('Gemini API review error:', error);
    // If API error occurs, fallback to a mock response so the UI doesn't crash
    return {
      title: 'Review System Fallback',
      score: 50,
      summary: `Failed to connect to the AI service: ${error.message}. Showing a fallback assessment.`,
      categories: {
        bugs: { rating: 'Critical', content: '### AI Service Connection Failure\nThe AI service returned an error. Please verify your `GEMINI_API_KEY` configuration in the server `.env` file.' },
        security: { rating: 'Good', content: 'No security analysis performed due to system fallback.' },
        performance: { rating: 'Good', content: 'No performance analysis performed due to system fallback.' },
        readability: { rating: 'Good', content: 'No readability analysis performed due to system fallback.' },
        bestPractices: { rating: 'Good', content: 'No best practices analysis performed due to system fallback.' },
        suggestedImprovements: { rating: 'Needs Improvement', content: 'Please check the console for details of the connection error.' }
      },
      refactoredCode: code
    };
  }
};

// Generates high-quality mock responses for testing purposes when no API key is present
const getMockReview = (code, language) => {
  return {
    title: `Mock Review of ${language.toUpperCase()} Code`,
    score: 72,
    summary: 'This is a simulated review generated because the server is running without a GEMINI_API_KEY. It simulates how actual responses are presented in the platform.',
    categories: {
      bugs: {
        rating: 'Needs Improvement',
        content: `### Bug Analysis
- **Resource Cleanup**: The provided **${language}** code lacks explicit resource cleanup. Consider wrapping resource-intensive objects in try-catch-finally or appropriate using-statements.
- **Boundary Conditions**: Ensure input values are verified to prevent off-by-one or null pointer errors during execution.
- **Type Safety**: Verify that type conversions do not silently fail or truncate data.`
      },
      security: {
        rating: 'Critical',
        content: `### Security Auditing
> [!WARNING]
> **Input Sanitization**: Any external input received by this code is not sanitized, creating potential vectors for injection or buffer overflow attacks.
- **Sensitive Data**: Avoid hardcoding configurations, constants, or credential templates inside the source file. Use environment variables instead.`
      },
      performance: {
        rating: 'Good',
        content: `### Performance Profile
- **Complexity**: The basic algorithm appears to run in $O(N)$ or $O(1)$ time complexity, which is acceptable for typical input ranges.
- **Allocation**: Memory allocations are kept within reasonable limits. For production workloads, consider using object pooling if this block is executed in a tight loop.`
      },
      readability: {
        rating: 'Needs Improvement',
        content: `### Code Readability
- **Naming Conventions**: Several variables use single-letter names or generic identifiers like \`data\` or \`temp\`. Rename them to descriptive nouns indicating their purpose (e.g. \`userRecord\`, \`processedIndex\`).
- **Formatting**: Maintain consistent spacing and indentation. Add comments before complex blocks to explain the *why* rather than the *how*.`
      },
      bestPractices: {
        rating: 'Needs Improvement',
        content: `### Coding Standards & Best Practices
- **Modularity**: The logic is highly cohesive but could be extracted into smaller, single-purpose functions to comply with the **Single Responsibility Principle (SRP)**.
- **Error Handling**: Replace broad catch-all exception blocks with specific catches (e.g., catching network or DB errors separately).`
      },
      suggestedImprovements: {
        rating: 'Needs Improvement',
        content: `### Suggested Improvements
- Create a dedicated utility class/helper for auxiliary actions.
- Wrap external API calls in a resilience pattern (e.g., retry with exponential backoff).
- Standardize logging rather than using stdout prints.`
      }
    },
    refactoredCode: `// Refactored Version of the submitted ${language} code
// This is a mockup showing improvements.
// Standardized imports and cleaner modular structure.

// TODO: Set GEMINI_API_KEY inside the backend/src/ .env file to get real reviews.
${code.split('\n').map(line => `// Optimized: ${line}`).join('\n')}`
  };
};
