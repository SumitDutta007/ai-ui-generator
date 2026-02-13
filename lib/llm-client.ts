// Groq LLM Client
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface LLMResponse {
  content: string;
  tokensUsed: number;
  durationMs: number;
}

export async function callLLM(
  prompt: string,
  temperature: number = 0.3,
): Promise<LLMResponse> {
  const startTime = Date.now();

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile", // Updated from deprecated llama-3.1-70b-versatile
      temperature,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || "";
    const tokensUsed = completion.usage?.total_tokens || 0;
    const durationMs = Date.now() - startTime;

    return {
      content,
      tokensUsed,
      durationMs,
    };
  } catch (error) {
    console.error("LLM call failed:", error);
    throw new Error(
      `LLM Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// Specialized calls for each agent
export async function callPlannerAgent(prompt: string): Promise<LLMResponse> {
  return callLLM(prompt, 0.2); // Low temperature for structured output
}

export async function callGeneratorAgent(prompt: string): Promise<LLMResponse> {
  return callLLM(prompt, 0.1); // Very low temperature for code generation
}

export async function callExplainerAgent(prompt: string): Promise<LLMResponse> {
  return callLLM(prompt, 0.5); // Higher temperature for natural language
}

export async function callQuickClassifier(
  prompt: string,
): Promise<LLMResponse> {
  return callLLM(prompt, 0.1); // Low temperature for classification
}
