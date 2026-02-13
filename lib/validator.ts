// Code Validator - Ensures generated code follows rules
import { ALLOWED_COMPONENTS } from "./component-registry";
import { ValidationResult } from "./types";

export function validateGeneratedCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const usedComponents: string[] = [];

  // 1. Check for prohibited patterns
  if (code.includes("style=")) {
    errors.push("Inline styles are not allowed");
  }

  if (code.match(/className=["'][^"']*\s*(bg-\[|text-\[|border-\[)/)) {
    errors.push("Arbitrary Tailwind values are not allowed");
  }

  if (code.includes("import")) {
    warnings.push(
      "Code should not contain import statements - all components are already available in scope",
    );
  }

  if (code.includes("export")) {
    warnings.push(
      "Code should not contain export statements - just define function GeneratedUI",
    );
  }

  // 2. Extract used components
  const componentRegex = /<([A-Z][a-zA-Z]*)/g;
  let match;
  while ((match = componentRegex.exec(code)) !== null) {
    const componentName = match[1];
    if (!usedComponents.includes(componentName)) {
      usedComponents.push(componentName);
    }
  }

  // 3. Validate all used components are in whitelist
  const invalidComponents = usedComponents.filter(
    (comp) => !ALLOWED_COMPONENTS.includes(comp),
  );

  if (invalidComponents.length > 0) {
    errors.push(
      `Unauthorized components used: ${invalidComponents.join(", ")}`,
    );
  }

  // 4. Check for basic syntax validity
  if (
    !code.includes("function GeneratedUI") &&
    !code.includes("const GeneratedUI")
  ) {
    errors.push("Missing GeneratedUI function");
  }

  if (!code.includes("return")) {
    errors.push("Missing return statement");
  }

  // 5. Check for dangerous patterns
  if (code.includes("dangerouslySetInnerHTML")) {
    errors.push("dangerouslySetInnerHTML is not allowed");
  }

  if (code.includes("eval(")) {
    errors.push("eval() is not allowed");
  }

  // 6. Component import validation
  const importMatch = code.match(
    /import\s*{([^}]+)}\s*from\s*['"]@\/components\/ui-library['"]/,
  );
  if (importMatch) {
    const importedComponents = importMatch[1]
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const unusedImports = importedComponents.filter(
      (comp) => !usedComponents.includes(comp),
    );

    if (unusedImports.length > 0) {
      warnings.push(`Unused imports: ${unusedImports.join(", ")}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    usedComponents: usedComponents.filter((c) =>
      ALLOWED_COMPONENTS.includes(c),
    ),
  };
}

// Sanitize user input to prevent prompt injection
export function sanitizeUserInput(input: string): string {
  // Remove or escape potentially dangerous patterns
  let sanitized = input
    .replace(/```/g, "") // Remove code blocks
    .replace(/<script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .trim();

  // Limit length
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500) + "...";
  }

  return sanitized;
}

// Extract JSON from LLM response (handles markdown wrapping)
export function extractJSON<T>(text: string): T {
  let cleaned = text.trim();

  // Remove markdown code blocks
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  }

  // Find JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in response");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(
      `Failed to parse JSON: ${e instanceof Error ? e.message : "Unknown error"}`,
    );
  }
}
