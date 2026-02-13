// AI Agent Prompt Templates
import {
    COMPONENT_REGISTRY,
    COMPONENTS_BY_CATEGORY,
} from "./component-registry";
import { ComponentPlan } from "./types";

// ========== PLANNER AGENT ==========
export function getPlannerPrompt(
  userIntent: string,
  currentCode?: string,
): string {
  const isModification = !!currentCode;

  const componentList = Object.entries(COMPONENTS_BY_CATEGORY)
    .map(([category, components]) => `${category}: ${components.join(", ")}`)
    .join("\n");

  return `You are a UI Layout Planner. Your job is to analyze user intent and create a structured plan for UI generation.

AVAILABLE COMPONENTS (FIXED - YOU CANNOT CREATE NEW ONES):
${componentList}

COMPONENT DETAILS:
${Object.entries(COMPONENT_REGISTRY)
  .map(
    ([name, schema]) =>
      `${name}: ${schema.description}\n  Props: ${Object.keys(schema.props).join(", ")}\n  Example: ${schema.example}`,
  )
  .join("\n\n")}

${
  isModification
    ? `CURRENT UI CODE:
\`\`\`tsx
${currentCode}
\`\`\`

USER MODIFICATION REQUEST: "${userIntent}"

IMPORTANT: This is a MODIFICATION request. You must:
1. Preserve existing structure where possible
2. Only change what the user requested
3. Do NOT regenerate the entire UI
4. Identify specific components to modify/add/remove
`
    : `USER REQUEST: "${userIntent}"

This is a NEW UI generation request.`
}

OUTPUT REQUIRED (JSON only, no markdown):
{
  "layout": {
    "type": "single-page|dashboard|form|data-display",
    "structure": "describe the high-level layout structure"
  },
  "components": [
    {
      "name": "ComponentName",
      "props": {"prop": "value"},
      "purpose": "why this component is used"
    }
  ],
  "dataFlow": "brief description of how data flows through the UI"
}

RULES:
- Use ONLY components from the allowed list
- Choose appropriate layout components (Container, Grid, Flex, Stack)
- Select display components that match the use case
- Ensure all required props are included
- Plan for VISUALLY IMPRESSIVE UI - cards, buttons, colors, spacing
- Always include Card, Button, and visual elements
- For modifications: minimize changes

VISUAL DESIGN PRIORITIES:
- Plan colorful, modern interfaces
- Include gradient headers and shadows
- Use Cards for sections
- Add Buttons for actions
- Ensure proper spacing and layout

Generate the plan now:`;
}

// ========== GENERATOR AGENT ==========
export function getGeneratorPrompt(
  plan: ComponentPlan,
  userIntent: string,
  currentCode?: string,
): string {
  const isModification = !!currentCode;

  return `You are a Code Generator. Convert the following UI plan into valid JavaScript code using React.createElement().

PLAN:
${JSON.stringify(plan, null, 2)}

USER INTENT: "${userIntent}"

${
  isModification
    ? `EXISTING CODE TO MODIFY:
\`\`\`javascript
${currentCode}
\`\`\`

CRITICAL: This is a MODIFICATION. You must:
1. Preserve all existing code structure
2. Only modify the parts mentioned in the plan
3. Keep imports, state, and unrelated components unchanged
4. Make surgical changes, NOT full rewrites
`
    : ""
}

CRITICAL CODE FORMAT REQUIREMENTS:
==========================================
1. Use React.createElement() syntax - NO JSX
2. DO NOT include import statements - all components are already available in scope
3. DO NOT use 'export default' - just write: function GeneratedUI() { ... }
4. Create a function component named 'GeneratedUI'
5. Include mock data where needed (realistic sample data)
6. Use ONLY the components specified in the plan
7. All components must have their required props
8. ABSOLUTELY NO inline styles (no style={{}}), NO custom CSS - use Tailwind classes only
9. NO creating new components
10. Code must be VISUALLY IMPRESSIVE and production-ready
11. NEVER use the style attribute - this will cause validation errors

SYNTAX EXAMPLES (React.createElement):
- HTML div: React.createElement('div', { className: 'bg-white p-6' }, 'Hello World')
- Card component: React.createElement(Card, { variant: 'elevated', className: 'shadow-xl' }, React.createElement(Text, { className: 'text-gray-900' }, 'Content'))
- Button: React.createElement(Button, { variant: 'primary', onClick: () => alert('Clicked!') }, 'Click Me')
- Grid: React.createElement(Grid, { cols: '3', gap: 'lg' }, React.createElement(Card, null, 'Item 1'), React.createElement(Card, null, 'Item 2'))

CRITICAL STYLING RULES (MANDATORY - FOLLOW EXACTLY):
========================================================

WRONG WAY (DO NOT DO THIS):
- Dark text on dark background
- Plain components without className
- No spacing or padding
- No shadows
- Boring appearance

RIGHT WAY (ALWAYS DO THIS):
1. WHITE BACKGROUNDS: Every Card MUST have bg-white or light background
2. DARK READABLE TEXT: Always text-gray-900 or text-gray-800 for main text
3. BIG SPACING: Use p-8, p-6, space-y-6, gap-6 generously
4. SHADOWS: Add shadow-lg or shadow-xl for visual depth
5. VIBRANT COLORS: Use bg-blue-600, bg-green-600, bg-purple-600 for buttons and accents
6. ROUNDED CORNERS: Use rounded-xl or rounded-lg everywhere
7. GRADIENTS: Use bg-linear-to-r from-blue-600 to-purple-600 for headers
8. HIGH CONTRAST: Every text MUST be readable on its background

MANDATORY PATTERNS TO USE:
- Container: Always add className="bg-linear-to-br from-blue-50 to-white p-8"
- Card: Always use variant="elevated" and add className="bg-white shadow-xl p-6 mb-6"
- Button: Always use variant="primary" or "secondary" and add className="shadow-lg"
- Headers: Wrap in div with className="bg-linear-to-r from-blue-600 to-purple-600 p-6 text-white rounded-xl"
- Text: Always add className="text-gray-900 text-lg" for body or "text-gray-600" for secondary
- Grid/Flex: Always add className="gap-6" and "p-6"

EXAMPLE STYLING (copy this style):
- Card with gradient header: Card variant="elevated" then div className="bg-linear-to-r from-blue-600 to-purple-600 p-6 -m-6 mb-6 rounded-t-xl" with white text
- Colorful buttons: Button variant="primary" className="shadow-lg text-lg px-8 py-3"
- Big spacing everywhere: p-6, p-8, space-y-6, gap-6
- Light backgrounds: bg-blue-50, bg-purple-50, bg-white
- Dark text: text-gray-900, text-gray-800

STYLING OPTIONS:
- All components accept className prop
- Use Tailwind utility classes: bg-{color}-{shade}, text-{color}-{shade}, p-{size}, shadow-{size}
- Add gradients: bg-linear-to-r from-COLOR to-COLOR
- Add shadows: shadow-sm, shadow-md, shadow-lg, shadow-xl
- Add spacing: p-4, p-6, p-8, m-4, space-y-4, gap-4, gap-6

OUTPUT FORMAT (React.createElement - NO imports, NO exports, NO markdown):
function GeneratedUI() {
  const mockData = [/* your data here */];
  
  return React.createElement(Container, { className: 'bg-linear-to-br from-blue-50 to-white p-8 min-h-screen' },
    React.createElement('div', { className: 'mb-8' },
      React.createElement('h1', { className: 'text-4xl font-bold text-gray-900 mb-2' }, 'Page Title'),
      React.createElement('p', { className: 'text-gray-600 text-lg' }, 'Descriptive subtitle')
    ),
    React.createElement(Grid, { cols: '3', gap: 'lg', className: 'mb-8' },
      React.createElement(Card, { variant: 'elevated', className: 'bg-white shadow-xl' },
        React.createElement('div', { className: 'bg-linear-to-r from-blue-600 to-purple-600 -m-6 mb-6 p-6 rounded-t-xl' },
          React.createElement('h3', { className: 'text-xl font-bold text-white' }, 'Card Title')
        ),
        React.createElement(Text, { className: 'text-gray-800 text-base mb-4' }, 'Card content with proper spacing'),
        React.createElement(Button, { variant: 'primary', className: 'shadow-lg w-full' }, 'Action')
      )
    )
  );
}

THIS IS THE MINIMUM STYLING LEVEL - Copy this pattern for ALL generated UIs.
REMEMBER: Use React.createElement() syntax, NO imports, NO exports, just the function!
Generate the code now (NO markdown blocks):`;
}

// ========== EXPLAINER AGENT ==========
export function getExplainerPrompt(
  userIntent: string,
  plan: ComponentPlan,
  code: string,
  isModification: boolean,
): string {
  return `You are a Technical Explainer. Explain the UI generation decisions in plain English.

USER INTENT: "${userIntent}"

PLAN USED:
${JSON.stringify(plan, null, 2)}

GENERATED CODE LENGTH: ${code.length} characters

${isModification ? "This was a MODIFICATION to existing UI." : "This was a NEW UI generation."}

Provide a clear, concise explanation covering:
1. What layout structure was chosen and why
2. Which components were selected and their purpose
3. How the components work together
4. ${isModification ? "What was changed and what was preserved" : "The overall design approach"}

Keep it under 150 words, friendly tone, technical but accessible.

Generate explanation:`;
}

// ========== CHECKPOINT NAMER ==========
export function getCheckpointNamePrompt(
  userIntent: string,
  componentNames: string[],
): string {
  return `Generate a concise checkpoint name (max 5 words) for this UI generation:

User requested: "${userIntent}"
Components used: ${componentNames.join(", ")}

Examples of good names:
- "Initial Dashboard Layout"
- "User Table Added"
- "Settings Modal Complete"
- "Chart Visualization Ready"

Generate checkpoint name (just the name, no quotes):`;
}

// ========== MODIFICATION CLASSIFIER ==========
export function getModificationClassifierPrompt(userIntent: string): string {
  return `Classify if this request is a MAJOR change or MINOR modification:

User request: "${userIntent}"

MAJOR changes include:
- Adding new sections/pages
- Changing overall layout structure
- Adding 3+ new components
- Complete redesigns

MINOR modifications include:
- Changing colors, sizes, text
- Adding single component
- Adjusting spacing/alignment
- Small content changes

Respond with JSON only:
{
  "classification": "major|minor",
  "shouldCreateCheckpoint": true|false,
  "reasoning": "brief explanation"
}`;
}
