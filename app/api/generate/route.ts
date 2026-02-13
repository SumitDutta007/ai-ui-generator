// API Route: Generate UI from natural language
import { orchestrateGeneration } from "@/lib/orchestrator";
import { sanitizeUserInput } from "@/lib/validator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIntent, currentCode, isModification } = body;

    if (!userIntent || typeof userIntent !== "string") {
      return NextResponse.json(
        { error: "userIntent is required and must be a string" },
        { status: 400 },
      );
    }

    // Sanitize input
    const sanitizedIntent = sanitizeUserInput(userIntent);

    // Orchestrate the AI generation pipeline
    const result = await orchestrateGeneration(
      sanitizedIntent,
      isModification ? currentCode : undefined,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
