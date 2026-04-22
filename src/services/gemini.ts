import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MarketingPlanResult {
  market_research: string;
  funnel: string;
  copies: string;
  headlines: string;
  offer: string;
}

export async function generateMarketingPlan(
  productName: string,
  price: string,
  audience: string,
  goal: string
): Promise<MarketingPlanResult> {
  const prompt = `
    You are a senior marketing strategist specializing in the Bangladesh market.
    Generate a full marketing plan for the following product:
    Product Name: ${productName}
    Price: ${price}
    Target Audience: ${audience}
    Goal: ${goal}

    Focus specifically on the cultural context of Bangladesh, popular platforms (e.g., Facebook, WhatsApp, f-commerce), and local consumer behavior.

    Return the result in structured parts:
    1. Market Research: Brief overview of the market landscape in Bangladesh for this product.
    2. Funnel Plan: A step-by-step funnel (TOFU, MOFU, BOFU) tailored for local users.
    3. Ad Copies: High-converting ad copies (mix of English and Bengali/Banglish if appropriate).
    4. Headlines: Catchy headlines.
    5. Offer Strategy: Irresistible offers (e.g., bundles, cash-on-delivery mentions).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          market_research: { type: Type.STRING },
          funnel: { type: Type.STRING },
          copies: { type: Type.STRING },
          headlines: { type: Type.STRING },
          offer: { type: Type.STRING },
        },
        required: ["market_research", "funnel", "copies", "headlines", "offer"],
      },
    },
  });

  return JSON.parse(response.text) as MarketingPlanResult;
}
