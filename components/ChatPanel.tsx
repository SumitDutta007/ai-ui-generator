"use client";

import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { BookmarkCheck, Loader2, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function ChatPanel() {
  const { messages, isGenerating, addMessage, checkpoints, restoreCheckpoint } =
    useAppStore();
  const [input, setInput] = useState("");
  const [createCheckpoint, setCreateCheckpoint] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasCheckedInitialPrompt, setHasCheckedInitialPrompt] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for initial prompt from landing page
  useEffect(() => {
    if (!hasCheckedInitialPrompt && typeof window !== "undefined") {
      const initialPrompt = sessionStorage.getItem("initialPrompt");
      if (initialPrompt) {
        setInput(initialPrompt);
        sessionStorage.removeItem("initialPrompt");
        setHasCheckedInitialPrompt(true);
      }
    }
  }, [hasCheckedInitialPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    addMessage({ role: "user", content: userMessage });

    // Call API
    const currentCode = useAppStore.getState().code;
    const isModification = !!currentCode;

    useAppStore.getState().setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIntent: userMessage,
          currentCode: isModification ? currentCode : undefined,
          isModification,
        }),
      });

      const result = await response.json();

      // Handle validation errors specially - show in chat but don't update code
      if (result.validationError) {
        addMessage({
          role: "assistant",
          content: result.explanation || `⚠️ Validation Error: ${result.errors?.join(", ")}`,
        });
        // Note: We don't update the code, so the preview stays unchanged
        // Don't create checkpoint for validation errors
        return;
      }

      if (result.success) {
        // Add AI response
        addMessage({
          role: "assistant",
          content: result.explanation,
        });

        // Update code only if validation passed
        useAppStore.getState().setCode(result.code, false);

        // Create checkpoint if requested
        if (createCheckpoint) {
          const checkpoint = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            label: result.checkpointLabel,
            userIntent: userMessage,
            isMarked: true,
            code: result.code,
            plan: result.plan,
            explanation: result.explanation,
            componentCount: result.plan.components.length,
            complexity: "moderate" as const,
            tags: result.plan.components.map((c: { name: string }) =>
              c.name.toLowerCase(),
            ),
          };

          await useAppStore.getState().addCheckpoint(checkpoint);
        }
      } else {
        // Handle general errors (show explanation if available, otherwise show raw error)
        addMessage({
          role: "assistant",
          content: result.explanation || `❌ Error: ${result.errors?.[0] || result.error || "Generation failed"}`,
        });
        // Don't update code on error - preview stays unchanged
      }
    } catch {
      // Network or API error
      addMessage({
        role: "assistant",
        content: `❌ **Connection Error**\n\nFailed to communicate with the AI service.\n\n💡 **Please check:**\n- Your internet connection\n- Groq API status\n- Rate limits (100K tokens/day for free tier)`,
      });
      // Don't update code on error - preview stays unchanged
    } finally {
      useAppStore.getState().setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/60 backdrop-blur-sm border-r border-white/10">
      {/* Header - Black with subtle transparency */}
      <div className="px-5 py-4 border-b border-white/10 bg-black/95 backdrop-blur-xl shadow-xl">
        <h2 className="text-xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          AI Chat
        </h2>
        <p className="text-sm text-gray-300 mt-1 font-semibold tracking-wide">
          Describe your vision ✨
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-16">
            <div className="inline-block p-8 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
              <p className="text-lg font-bold text-white mb-6 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ✨ Ready to create something amazing?
              </p>
              <div className="mt-6 text-sm space-y-3 text-left">
                <p className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/15 transition-all">
                  <span className="text-2xl">💡</span>
                  <span className="text-gray-200 font-medium">
                    &quot;Create a dashboard with user stats&quot;
                  </span>
                </p>
                <p className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/15 transition-all">
                  <span className="text-2xl">💡</span>
                  <span className="text-gray-200 font-medium">
                    &quot;Add a data table with pagination&quot;
                  </span>
                </p>
                <p className="flex items-center gap-3 p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl hover:bg-pink-500/15 transition-all">
                  <span className="text-2xl">💡</span>
                  <span className="text-gray-200 font-medium">
                    &quot;Make the cards bigger with gradients&quot;
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          // Find checkpoint associated with this message
          const checkpoint = checkpoints.find(
            (cp) =>
              messages[index] &&
              messages[index].role === "assistant" &&
              Math.abs(cp.timestamp - message.timestamp) < 5000, // Within 5 seconds
          );
          const hasCheckpoint = !!checkpoint;

          return (
            <div key={message.id}>
              {/* Bookmark Icon for Assistant Messages with Checkpoints */}
              {message.role === "assistant" && hasCheckpoint && (
                <div className="flex items-center gap-2 mb-2 ml-2">
                  <button
                    onClick={() =>
                      checkpoint && restoreCheckpoint(checkpoint.id)
                    }
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:text-blue-300 transition-all text-xs group shadow-lg shadow-blue-500/10"
                    title="Restore this checkpoint"
                  >
                    <BookmarkCheck
                      size={16}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-semibold">{checkpoint.label}</span>
                  </button>
                </div>
              )}

              <div
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 backdrop-blur-xl shadow-xl border ${
                    message.role === "user"
                      ? "bg-linear-to-br from-blue-600 via-blue-500 to-purple-600 text-white shadow-blue-500/30 border-blue-400/20"
                      : message.role === "system"
                        ? "bg-black/80 border-white/20 text-gray-200 italic"
                        : message.content.includes("❌") || message.content.includes("⚠️")
                          ? "bg-red-950/40 border-red-500/30 text-red-100 shadow-red-500/20"
                          : "bg-black/80 border-white/20 text-white"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed font-medium prose prose-invert prose-sm max-w-none">
                    {/* Render markdown-style formatting */}
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold text-base my-2">{line.replace(/\*\*/g, '')}</p>;
                      } else if (line.startsWith('---')) {
                        return <hr key={i} className="my-4 border-white/20" />;
                      } else if (line.startsWith('- ')) {
                        return <p key={i} className="ml-4 my-1">{line}</p>;
                      } else if (line.includes('`') && !line.startsWith('```')) {
                        const parts = line.split('`');
                        return (
                          <p key={i} className="my-1">
                            {parts.map((part, j) => 
                              j % 2 === 1 ? <code key={j} className="bg-white/10 px-2 py-0.5 rounded text-blue-300">{part}</code> : part
                            )}
                          </p>
                        );
                      } else if (line.trim()) {
                        return <p key={i} className="my-1">{line}</p>;
                      } else {
                        return <br key={i} />;
                      }
                    })}
                  </div>
                  <p
                    className={`text-xs mt-2 font-semibold ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    {format(message.timestamp, "HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 flex items-center space-x-3 shadow-xl">
              <Loader2 className="animate-spin text-blue-400" size={20} />
              <span className="text-sm text-gray-200 font-bold tracking-wide">
                Generating UI...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-5 bg-black/95 backdrop-blur-xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="createCheckpoint"
              checked={createCheckpoint}
              onChange={(e) => setCreateCheckpoint(e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-white/5 border-white/20 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="createCheckpoint"
              className="text-sm text-gray-300 font-medium cursor-pointer"
            >
              📍 Create checkpoint
            </label>
          </div>

          <div className="flex items-end space-x-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your vision... ✨"
              rows={3}
              disabled={isGenerating}
              className="flex-1 px-5 py-4 bg-black/60 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-50 shadow-xl transition-all font-medium"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="px-6 py-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed h-[60px] flex items-center justify-center shadow-2xl shadow-blue-500/40 transition-all duration-300 hover:shadow-3xl hover:shadow-blue-500/50 active:scale-95 font-bold"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Press <span className="text-blue-400 font-medium">Enter</span> to
            send,{" "}
            <span className="text-purple-400 font-medium">Shift+Enter</span> for
            new line
          </p>
        </form>
      </div>
    </div>
  );
}
