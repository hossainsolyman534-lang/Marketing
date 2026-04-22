import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MarketingPlanResult {
  market_research: {
    who_buys: string;
    problems: string;
    psychology: string;
    price_insight: string;
    competitor: string;
    demand: string;
  };
  funnel: string;
  ad_copies: string[];
  headlines: string[];
  offer: string;
}

export async function generateMarketingPlan(
  productName: string,
  price: string,
  audience: string,
  goal: string
): Promise<MarketingPlanResult> {
  const prompt = `
    Always respond in structured JSON format.
    You are a highly experienced Bangladeshi Facebook marketer.
    You write like a real human seller, not AI. Use natural Bangla, human tone, emotional and realistic language.
    Context: Bangladesh market, cultural nuances, local consumer behavior.

    INPUT:
    Product: ${productName}
    Price: ${price}
    Target Audience: ${audience}
    Goal: ${goal}

    Return the response in this exact JSON structure:
    {
      "market_research": {
        "who_buys": "Who exactly is the buyer?",
        "problems": "What burning problem does this solve?",
        "psychology": "What is the psychological trigger for buying this?",
        "price_insight": "Insight on the pricing in the local market.",
        "competitor": "Who are the competitors and how to beat them?",
        "demand": "Current market demand assessment."
      },
      "funnel": "Step by step funnel plan.",
      "ad_copies": ["Copy 1", "Copy 2", "Copy 3"],
      "headlines": ["Head 1", "Head 2", "Head 3", "Head 4", "Head 5"],
      "offer": "Irrissistible offer strategy with urgency."
    }

    Instruction:
    - Write in natural Bangla
    - Keep tone human, emotional, realistic
    - Avoid robotic language
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          market_research: {
            type: Type.OBJECT,
            properties: {
              who_buys: { type: Type.STRING },
              problems: { type: Type.STRING },
              psychology: { type: Type.STRING },
              price_insight: { type: Type.STRING },
              competitor: { type: Type.STRING },
              demand: { type: Type.STRING },
            },
            required: ["who_buys", "problems", "psychology", "price_insight", "competitor", "demand"],
          },
          funnel: { type: Type.STRING },
          ad_copies: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          headlines: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          offer: { type: Type.STRING },
        },
        required: ["market_research", "funnel", "ad_copies", "headlines", "offer"],
      },
    },
  });

  return JSON.parse(response.text) as MarketingPlanResult;
}
