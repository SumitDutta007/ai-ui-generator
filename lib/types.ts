// Core types for the AI UI Generator

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ComponentPlan {
  layout: {
    type: string;
    structure: string;
  };
  components: Array<{
    name: string;
    props: Record<string, unknown>;
    purpose: string;
  }>;
  dataFlow: string;
}

export interface Checkpoint {
  id: string;
  timestamp: number;
  label: string;
  userIntent: string;
  isMarked: boolean; // Manual checkpoint vs auto-save

  // The actual UI state
  code: string;
  plan: ComponentPlan;
  explanation: string;

  // Metadata
  componentCount: number;
  complexity: "simple" | "moderate" | "complex";
  tags: string[];
}

export interface Iteration {
  id: string;
  timestamp: number;
  parentCheckpointId: string;
  userMessage: string;
  aiResponse: string;
  codeChanges?: {
    added: string[];
    modified: string[];
    removed: string[];
  };
}

export interface UIVersion {
  id: string;
  checkpointId: string;
  code: string;
  timestamp: number;
}

export interface GenerationRequest {
  userIntent: string;
  currentCode?: string;
  isModification: boolean;
  createCheckpoint: boolean;
}

export interface GenerationResponse {
  plan: ComponentPlan;
  code: string;
  explanation: string;
  checkpointLabel: string;
  success: boolean;
  errors?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  usedComponents: string[];
}

export interface AgentStep {
  agent: "planner" | "generator" | "explainer";
  input: string;
  output: string;
  timestamp: number;
  durationMs: number;
}

export interface GenerationSession {
  id: string;
  startTime: number;
  endTime?: number;
  steps: AgentStep[];
  result: GenerationResponse;
}
