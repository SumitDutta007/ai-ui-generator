# 🎨 RyzeAI UI Generator

**AI Agent → Deterministic UI Generator (Claude-Code Style)**

A next-generation AI-powered UI builder that converts natural language intent into working React UI using a fixed, deterministic component library. Built with multi-agent orchestration for safe, reproducible, and debuggable UI generation.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-deployment-url.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Overview

This application implements a **deterministic AI UI generator** that:

- ✅ Converts natural language → working UI code + live preview
- ✅ Uses a **fixed component library** (no dynamic component creation)
- ✅ Supports **iterative modifications** (no full rewrites)
- ✅ Provides **explainable AI decisions**
- ✅ Enables **version rollback** with checkpoints
- ✅ Ensures **visual consistency** across all generations

## 🚀 Live Demo

**Deployed Application:** [https://your-deployment-url.vercel.app](https://your-deployment-url.vercel.app)

**Demo Video:** [Watch 5-min Demo](https://your-video-link.com)

## 📋 Key Features

### ✨ Multi-Agent Architecture

- **Planner Agent**: Interprets user intent, chooses layout, selects components
- **Generator Agent**: Converts plan to React code using only allowed components
- **Validator**: Enforces component whitelist and code safety
- **Explainer Agent**: Provides plain English explanations of decisions

### 🔒 Deterministic Component System

All UIs use the **exact same fixed component library**:

- `Container`, `Card`, `Grid`, `Flex`
- `Button`, `Input`, `Select`, `Checkbox`
- `Text`, `Heading`, `Badge`
- `Table`, `ProgressBar`, `Divider`
- `Alert`, `Avatar`, `Stat`, `Metric`
- `BarChart`, `LineChart`, `PieChart`, `AreaChart`

**Prohibited:**

- ❌ Inline styles
- ❌ AI-generated CSS
- ❌ Arbitrary Tailwind classes
- ❌ New component creation
- ❌ External UI libraries

### 🔄 Iterative Editing

- **Surgical modifications**: Changes only requested parts
- **Preserves structure**: Maintains existing components and state
- **Context-aware**: Understands what "this" and "these cards" refer to
- **No full rewrites**: Unless explicitly requested

### 📌 Checkpoint System

- Auto-creates checkpoints after each generation
- Bookmark icon above AI messages
- One-click restoration to previous versions
- Preserves code, plan, and explanation

### 🎨 Claude-Style Interface

- **Left Panel**: AI chat for user intent
- **Right Panel**: Tabbed Code Editor / Live Preview
- **Resizable columns**: Drag to adjust layout
- **Real-time updates**: Preview refreshes on code change

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Intent (Chat)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  Orchestrator  │
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
  ┌─────────┐   ┌──────────┐   ┌──────────┐
  │ Planner │   │Generator │   │Explainer │
  │  Agent  │──▶│  Agent   │──▶│  Agent   │
  └─────────┘   └─────┬────┘   └──────────┘
                      │
                      ▼
              ┌───────────────┐
              │   Validator    │
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   Live Preview    Code Editor   Checkpoint
```

### Agent Flow

1. **Planner Agent** (`lib/prompts.ts::getPlannerPrompt`)
   - Analyzes user intent
   - Selects components from fixed library
   - Outputs structured JSON plan
   - Considers existing code for modifications

2. **Generator Agent** (`lib/prompts.ts::getGeneratorPrompt`)
   - Receives component plan
   - Generates React.createElement code
   - **Critical**: No imports, no exports, just function
   - Applies strict styling rules (white backgrounds, dark text, shadows)

3. **Validator** (`lib/validator.ts`)
   - Enforces component whitelist
   - Blocks inline styles
   - Checks for required function signature
   - Validates return statement

4. **Explainer Agent** (`lib/prompts.ts::getExplainerPrompt`)
   - Describes layout decisions
   - Explains component choices
   - Justifies modifications
   - Plain English, <150 words

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Groq API Key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/SumitDutta007/ai-ui-generator.git
cd ai-ui-generator
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from: [https://console.groq.com/keys](https://console.groq.com/keys)

4. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-ui-generator/
├── app/
│   ├── page.tsx              # Landing page
│   ├── app/page.tsx          # Main app route
│   └── api/generate/route.ts # Generation API endpoint
├── components/
│   ├── MainLayout.tsx        # Claude-style split layout
│   ├── ChatPanel.tsx         # Left: User intent chat
│   ├── CodeEditor.tsx        # Right: Monaco editor
│   ├── LivePreview.tsx       # Right: Rendered UI preview
│   └── ui-library/           # Fixed component library
├── lib/
│   ├── orchestrator.ts       # Multi-agent orchestration
│   ├── prompts.ts            # Agent prompt templates
│   ├── llm-client.ts         # Groq LLM integration
│   ├── validator.ts          # Code validation
│   ├── component-registry.ts # Component whitelist + schemas
│   ├── store.ts              # Zustand state management
│   └── db.ts                 # Dexie IndexedDB
└── types/index.ts            # TypeScript definitions
```

## 🎮 Usage Examples

### Generate Initial UI

```
User: "Create a dashboard showing user statistics"
AI: Generates Container with Grid of Stat cards and BarChart
```

### Iterative Modification

```
User: "Make the cards bigger and add shadows"
AI: Modifies className, preserves all existing components
```

### Add New Feature

```
User: "Add a settings button in the top right"
AI: Adds Button, preserves dashboard structure
```

## ⚠️ Known Limitations

1. **No State Management**: Generated UIs are stateless
2. **Mock Data Only**: Charts use hardcoded data
3. **No Authentication**: Single-user experience
4. **English Only**: Prompts assume English input
5. **Token Limits**: Very complex UIs may hit API limits

## 🚀 Future Improvements

- [ ] Streaming AI responses
- [ ] Diff view between versions
- [ ] Component schema validation with Zod
- [ ] Replayable generation sessions
- [ ] Static analysis (ESLint integration)
- [ ] Custom theming system
- [ ] Export to CodeSandbox/Figma

## 📊 Technical Stack

- **Frontend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Storage**: Dexie.js (IndexedDB)
- **Code Editor**: Monaco Editor
- **LLM**: Groq (llama-3.3-70b-versatile)
- **Charts**: Recharts

## 🎯 Evaluation Criteria Checklist

| Criteria                        | Status |
| ------------------------------- | ------ |
| Multi-step agent design         | ✅     |
| Deterministic components        | ✅     |
| Iterative modifications         | ✅     |
| Explainable decisions           | ✅     |
| Version rollback                | ✅     |
| Component whitelist enforcement | ✅     |
| Prompt separation               | ✅     |
| Live preview                    | ✅     |
| Safety validation               | ✅     |

## 👤 Author

**Sumit Dutta**

- GitHub: [@SumitDutta007](https://github.com/SumitDutta007)

## 📄 License

MIT License

---

**Assignment Submission for Ryze AI Full-Stack Position**

📅 Submitted: February 2026  
⏱️ Completed within 72-hour timebox  
🎯 All requirements met
