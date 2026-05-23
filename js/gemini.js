/* ============================================================================
   Google Gemini API Integration — AI Review Replies & Sentiment Analysis
   ============================================================================ */

const GEMINI_API_KEY = 'AIzaSyCO2VrVU4h9lo8JbcB4y2L42ygJ7DMIIUA'; // Add your Gemini API key
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Generate an AI-powered reply to a customer review
 * @param {string} reviewText - The customer's review text
 * @param {number} rating - Star rating (1-5)
 * @param {string} businessName - Business name for context
 * @returns {Promise<string>} - Generated reply text
 */
async function generateReviewReply(reviewText, rating, businessName) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    throw new Error('Gemini API key not configured');
  }

  const systemPrompt = `You are a professional and warm business owner named ${businessName}. 
Write a genuine, friendly reply to this customer's Google review. 
Keep it under 80 words. 
- Thank them specifically for their feedback
- Address their main point directly
- If positive (4-5 stars): Express gratitude and invite them back
- If neutral (3 stars): Acknowledge their feedback and offer to improve
- If negative (1-2 stars): Apologize sincerely and ask how you can make it right
- Be authentic - no generic corporate speak`;

  const userPrompt = `Customer Review (${rating}/5 stars): "${reviewText}"

Please write a professional reply that acknowledges their specific feedback.`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt + '\n\n' + userPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini API error');
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid Gemini response');
    }

    const reply = data.candidates[0].content.parts[0].text.trim();
    return reply;
  } catch (error) {
    console.error('Error generating reply:', error);
    throw error;
  }
}

/**
 * Analyze sentiment of a review
 * @param {string} reviewText - The review text to analyze
 * @returns {Promise<string>} - Sentiment: 'Positive', 'Neutral', or 'Negative'
 */
async function analyzeSentiment(reviewText) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    return 'Neutral'; // Fallback if API key not set
  }

  const prompt = `Analyze the sentiment of this customer review and respond with ONLY ONE WORD from this list: Positive, Neutral, or Negative.

Review: "${reviewText}"

Your response (one word only):`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10,
        },
      }),
    });

    if (!response.ok) {
      console.error('Sentiment analysis error:', await response.json());
      return 'Neutral';
    }

    const data = await response.json();
    const sentiment = data.candidates[0].content.parts[0].text
      .trim()
      .toLowerCase()
      .replace(/[^\w]/g, '');

    if (sentiment === 'positive') return 'Positive';
    if (sentiment === 'negative') return 'Negative';
    return 'Neutral';
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return 'Neutral';
  }
}

/**
 * Batch analyze sentiments for multiple reviews
 * @param {Array<string>} reviewTexts - Array of review texts
 * @returns {Promise<Array<string>>} - Array of sentiments
 */
async function analyzeSentimentBatch(reviewTexts) {
  try {
    const sentiments = await Promise.all(
      reviewTexts.map((text) => analyzeSentiment(text).catch(() => 'Neutral'))
    );
    return sentiments;
  } catch (error) {
    console.error('Error in batch sentiment analysis:', error);
    return reviewTexts.map(() => 'Neutral');
  }
}

/**
 * Test function to check if Gemini API is working
 */
async function testGeminiConnection() {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    console.warn('Gemini API key not configured. AI features will be limited.');
    return false;
  }

  try {
    const testReply = await generateReviewReply(
      'Great service, very helpful staff!',
      5,
      'Test Business'
    );
    console.log('✓ Gemini API connection successful');
    console.log('Sample reply:', testReply);
    return true;
  } catch (error) {
    console.error('✗ Gemini API connection failed:', error);
    return false;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateReviewReply,
    analyzeSentiment,
    analyzeSentimentBatch,
    testGeminiConnection,
  };
}
