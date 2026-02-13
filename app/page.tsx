"use client";

import {
  ArrowRight,
  Code,
  Eye,
  Github,
  Layers,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const handleTryNow = () => {
    if (prompt.trim()) {
      sessionStorage.setItem("initialPrompt", prompt);
    }
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-linear-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

        {/* Animated grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-black/30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-75"></div>
                <div className="relative bg-linear-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Sparkles className="text-white" size={24} />
                </div>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RyzeAI
              </span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
            >
              <Github size={20} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 py-20 sm:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
              <Zap size={16} className="text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">
                AI-Powered UI Generation
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-7xl font-bold leading-tight">
              <span className="bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Create Stunning UIs
              </span>
              <br />
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                With Just Words
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into beautiful, production-ready React
              components using advanced AI.
              <span className="text-white font-semibold">
                {" "}
                No coding required.
              </span>
            </p>

            {/* Features */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Code size={18} className="text-blue-400" />
                <span className="text-sm">TypeScript</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Eye size={18} className="text-purple-400" />
                <span className="text-sm">Live Preview</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Layers size={18} className="text-pink-400" />
                <span className="text-sm">20+ Components</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Sparkles size={18} className="text-green-400" />
                <span className="text-sm">Groq AI</span>
              </div>
            </div>

            {/* Input Section */}
            <div className="max-w-3xl mx-auto pt-8">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>

                <div className="relative bg-linear-to-r from-gray-900 to-black border border-white/20 rounded-2xl p-6 backdrop-blur-xl">
                  <label
                    htmlFor="prompt"
                    className="block text-left text-sm font-medium text-gray-300 mb-3"
                  >
                    Describe your UI
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        handleTryNow();
                      }
                    }}
                    placeholder="e.g., Create a dashboard with user statistics, charts, and a data table..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                    rows={4}
                  />

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={handleTryNow}
                      className="flex-1 group/btn relative bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <Play size={20} />
                        <span>Try It Now</span>
                        <ArrowRight
                          size={20}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    No sign-up required • Powered by Groq AI • Free to use
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Examples */}
            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-4">
                Quick examples to try:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Create a modern dashboard",
                  "Build a pricing page",
                  "Design a contact form",
                  "Make a feature showcase",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setPrompt(example)}
                    className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="text-blue-400" size={32} />,
                title: "AI-Powered Generation",
                description:
                  "Advanced language models understand your intent and generate production-ready React code instantly.",
              },
              {
                icon: <Code className="text-purple-400" size={32} />,
                title: "Clean, Type-Safe Code",
                description:
                  "Get TypeScript components with proper types, best practices, and a fixed component library.",
              },
              {
                icon: <Eye className="text-pink-400" size={32} />,
                title: "Live Preview & Edit",
                description:
                  "See your UI come to life instantly. Toggle between code and preview, make iterative changes.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-transparent hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
            <p>Built with Next.js, TypeScript, Tailwind CSS, and Groq AI</p>
            <p className="mt-2">© 2026 RyzeAI. Open source and free to use.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
