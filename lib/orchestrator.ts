// AI Agent Orchestrator - Multi-step generation pipeline
import {
    callExplainerAgent,
    callGeneratorAgent,
    callPlannerAgent,
    callQuickClassifier,
} from "./llm-client";
import {
    getCheckpointNamePrompt,
    getExplainerPrompt,
    getGeneratorPrompt,
    getModificationClassifierPrompt,
    getPlannerPrompt,
} from "./prompts";
import { AgentStep, ComponentPlan, GenerationResponse } from "./types";
import { validateGeneratedCode } from "./validator";

// Helper function to format validation errors for user display
function formatValidationError(errors: string[], userIntent: string): string {
  const errorMessages: string[] = [];

  errors.forEach((error) => {
    if (error.includes("Inline styles")) {
      errorMessages.push(
        "❌ **Inline Styles Not Allowed**\n\n" +
        "I cannot create components with inline `style={{...}}` attributes. " +
        "All styling must use the pre-defined Tailwind classes built into our fixed component library.\n\n" +
        "💡 **Why?** This ensures visual consistency across all generated UIs."
      );
    } else if (error.includes("Unauthorized components")) {
      const match = error.match(/Unauthorized components used: (.+)/);
      const components = match ? match[1] : "some components";
      errorMessages.push(
        `❌ **Component Not Available**\n\n` +
        `I cannot use \`${components}\` because they're not in our fixed component library.\n\n` +
        `✅ **Available components include:**\n` +
        `- Layout: Container, Grid, Flex, Card\n` +
        `- Input: Button, Input, Select, Checkbox\n` +
        `- Display: Text, Heading, Badge, Alert, Avatar\n` +
        `- Data: Table, ProgressBar, Stat, Metric\n` +
        `- Charts: BarChart, LineChart, PieChart, AreaChart\n\n` +
        `💡 **Try rephrasing:** "${userIntent}" using these components.`
      );
    } else if (error.includes("Arbitrary Tailwind")) {
      errorMessages.push(
        "❌ **Custom Tailwind Values Not Allowed**\n\n" +
        "I cannot use arbitrary Tailwind values like `bg-[#ff0000]` or `text-[20px]`. " +
        "Only standard Tailwind classes from our component library are permitted.\n\n" +
        "💡 **Why?** This maintains a consistent design system."
      );
    } else {
      errorMessages.push(`❌ **Validation Error**\n\n${error}`);
    }
  });

  return errorMessages.join("\n\n---\n\n");
}

export interface OrchestrationResult extends GenerationResponse {
  steps: AgentStep[];
  totalDurationMs: number;
}

export async function orchestrateGeneration(
  userIntent: string,
  currentCode?: string,
): Promise<OrchestrationResult> {
  const steps: AgentStep[] = [];
  const startTime = Date.now();
  const isModification = !!currentCode;

  try {
    // Step 1: PLANNER AGENT
    console.log("🧠 Running Planner Agent...");
    const plannerStart = Date.now();
    const plannerPrompt = getPlannerPrompt(userIntent, currentCode);
    const plannerResponse = await callPlannerAgent(plannerPrompt);

    steps.push({
      agent: "planner",
      input: userIntent,
      output: plannerResponse.content,
      timestamp: Date.now(),
      durationMs: Date.now() - plannerStart,
    });

    // Parse plan
    let plan: ComponentPlan;
    try {
      // Remove markdown code blocks if present
      let planContent = plannerResponse.content.trim();
      if (planContent.startsWith("```")) {
        planContent = planContent
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "");
      }
      plan = JSON.parse(planContent);
    } catch (e) {
      throw new Error(
        `Failed to parse plan: ${e instanceof Error ? e.message : "Invalid JSON"}`,
      );
    }

    // Step 2: GENERATOR AGENT
    console.log("⚙️ Running Generator Agent...");
    const generatorStart = Date.now();
    const generatorPrompt = getGeneratorPrompt(plan, userIntent, currentCode);
    const generatorResponse = await callGeneratorAgent(generatorPrompt);

    steps.push({
      agent: "generator",
      input: JSON.stringify(plan),
      output: generatorResponse.content,
      timestamp: Date.now(),
      durationMs: Date.now() - generatorStart,
    });

    // Clean code (remove markdown if present)
    let code = generatorResponse.content.trim();
    if (code.startsWith("```")) {
      code = code
        .replace(/```(javascript|jsx|js|tsx?|typescript)?\n?/g, "")
        .replace(/```\n?/g, "");
    }

    // Step 3: VALIDATE CODE (with retry on validation failure)
    console.log("✅ Validating generated code...");
    let validation = validateGeneratedCode(code);
    let retryCount = 0;
    const maxRetries = 2;

    while (!validation.valid && retryCount < maxRetries) {
      console.log(
        `⚠️ Validation failed (attempt ${retryCount + 1}/${maxRetries}): ${validation.errors.join(", ")}`,
      );
      console.log("🔄 Retrying generation with validation feedback...");

      // Retry with error feedback
      const retryPrompt = `${getGeneratorPrompt(plan, userIntent, currentCode)}

PREVIOUS ATTEMPT FAILED VALIDATION WITH THESE ERRORS:
${validation.errors.map((err) => `- ${err}`).join("\n")}

CRITICAL FIXES REQUIRED:
${validation.errors.includes("Inline styles are not allowed") ? '- Remove ALL style={{...}} attributes\n- Use className with Tailwind classes instead\n- Example: use className="bg-blue-500" NOT style={{backgroundColor: "blue"}}' : ""}
${validation.errors.filter((err) => err.includes("Unauthorized components")).length > 0 ? "- Use ONLY components from the allowed list\n- Check the component registry" : ""}

Generate the corrected code now (NO style attributes allowed):`;

      const retryResponse = await callGeneratorAgent(retryPrompt);
      code = retryResponse.content.trim();
      if (code.startsWith("```")) {
        code = code.replace(/```tsx?\n?/g, "").replace(/```\n?/g, "");
      }

      validation = validateGeneratedCode(code);
      retryCount++;
    }

    if (!validation.valid) {
      // Instead of throwing, return a user-friendly error that can be displayed in chat
      // Keep the previous working code in preview
      const userFriendlyError = formatValidationError(validation.errors, userIntent);
      
      return {
        plan: {
          layout: { type: "error", structure: "Validation failed" },
          components: [],
          dataFlow: "Error",
        },
        code: currentCode || "", // Keep existing code if available
        explanation: userFriendlyError,
        checkpointLabel: "Validation Error",
        success: false,
        validationError: true, // Flag to indicate this is a validation error
        errors: validation.errors,
        steps,
        totalDurationMs: Date.now() - startTime,
      };
    }

    // Step 4: EXPLAINER AGENT
    console.log("📝 Running Explainer Agent...");
    const explainerStart = Date.now();
    const explainerPrompt = getExplainerPrompt(
      userIntent,
      plan,
      code,
      isModification,
    );
    const explainerResponse = await callExplainerAgent(explainerPrompt);

    steps.push({
      agent: "explainer",
      input: "Generate explanation",
      output: explainerResponse.content,
      timestamp: Date.now(),
      durationMs: Date.now() - explainerStart,
    });

    // Step 5: GENERATE CHECKPOINT NAME
    console.log("🏷️ Generating checkpoint name...");
    const componentNames = validation.usedComponents;
    const namePrompt = getCheckpointNamePrompt(userIntent, componentNames);
    const nameResponse = await callQuickClassifier(namePrompt);
    const checkpointLabel = nameResponse.content.trim().replace(/"/g, "");

    const totalDurationMs = Date.now() - startTime;

    console.log(`✨ Generation complete in ${totalDurationMs}ms`);

    return {
      plan,
      code,
      explanation: explainerResponse.content.trim(),
      checkpointLabel,
      success: true,
      steps,
      totalDurationMs,
    };
  } catch (error) {
    console.error("❌ Generation failed:", error);

    // Format user-friendly error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const userFriendlyMessage = 
      `❌ **Generation Error**\n\n` +
      `I encountered an issue while generating your UI:\n\n` +
      `${errorMessage}\n\n` +
      `💡 **Try:**\n` +
      `- Simplifying your request\n` +
      `- Being more specific about what you want\n` +
      `- Breaking down complex requests into smaller steps`;

    return {
      plan: {
        layout: { type: "error", structure: "Error occurred" },
        components: [],
        dataFlow: "Error",
      },
      code: currentCode || "", // Keep existing code to preserve preview
      explanation: userFriendlyMessage,
      checkpointLabel: "Error",
      success: false,
      validationError: false, // This is a generation error, not validation
      errors: [errorMessage],
      steps,
      totalDurationMs: Date.now() - startTime,
    };
  }
}

// Auto-determine if we should create a checkpoint
export async function shouldAutoCheckpoint(
  userIntent: string,
): Promise<{ shouldCheckpoint: boolean; reasoning: string }> {
  try {
    const prompt = getModificationClassifierPrompt(userIntent);
    const response = await callQuickClassifier(prompt);

    let result = response.content.trim();
    if (result.startsWith("```")) {
      result = result.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(result);

    return {
      shouldCheckpoint: parsed.shouldCreateCheckpoint,
      reasoning: parsed.reasoning,
    };
  } catch {
    // Default to creating checkpoint on classification error
    return {
      shouldCheckpoint: true,
      reasoning: "Auto-checkpoint on classification error",
    };
  }
}
