"use client";

import { Code, Eye, Github, GripVertical, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ChatPanel from "./ChatPanel";
import CodeEditor from "./CodeEditor";
import LivePreview from "./LivePreview";

export default function MainLayout() {
  const [leftWidth, setLeftWidth] = useState(400); // Chat panel width
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newWidth = e.clientX;
    if (newWidth > 300 && newWidth < 800) {
      setLeftWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="flex flex-col h-screen bg-black"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Animated Background Effects - Colored Lights on Black */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Pure black base */}
        <div className="absolute inset-0 bg-black" />

        {/* Colorful Light Orbs - Like lights in darkness */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-125 h-125 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-100 h-100 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-40 right-40 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1500" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[100px_100px]" />
      </div>

      {/* Top Header - Pure Black with subtle transparency */}
      <header className="relative z-10 bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 p-3 rounded-xl shadow-2xl group-hover:scale-105 transition-transform">
                <Sparkles className="text-white" size={28} />
              </div>
            </Link>
            <div>
              <h1 className="text-2xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                RyzeAI UI Generator
              </h1>
              <p className="text-sm text-gray-400 font-semibold tracking-wide">
                Next-Gen AI-Powered UI Builder
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <Link
              href="/"
              className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-300 font-semibold group backdrop-blur-xl shadow-lg hover:shadow-blue-500/20"
            >
              <Home
                size={18}
                className="group-hover:scale-110 group-hover:text-blue-400 transition-all"
              />
              <span>Home</span>
            </Link>
            <div className="flex items-center space-x-2 px-5 py-2.5 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-xl shadow-lg shadow-green-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400 shadow-lg shadow-green-400/50"></span>
              </span>
              <span className="text-green-400 font-bold tracking-wide">
                Groq Connected
              </span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-blue-400 hover:text-blue-300 transition-all duration-300 font-semibold group backdrop-blur-xl shadow-lg hover:shadow-purple-500/20"
            >
              <Github
                size={18}
                className="group-hover:scale-110 group-hover:rotate-12 transition-all"
              />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left Panel: Chat */}
        <div style={{ width: leftWidth }} className="shrink-0">
          <ChatPanel />
        </div>

        {/* Resizer - Premium Glowing */}
        <div
          onMouseDown={handleMouseDown}
          className={`relative w-1 cursor-col-resize transition-all duration-300 group ${
            isDragging
              ? "bg-linear-to-b from-blue-500 via-purple-500 to-pink-500 shadow-2xl shadow-blue-500/50 w-1.5"
              : "bg-gradient-to-b from-white/20 to-white/10 hover:bg-linear-to-b hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:shadow-xl hover:shadow-blue-500/30"
          }`}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical size={16} className="text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Right Panel: Code/Preview with Tabs */}
        <div className="flex-1 flex flex-col bg-black/50 backdrop-blur-sm">
          {/* Tab Header - Black with subtle transparency */}
          <div className="flex items-center bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-300 ${
                activeTab === "preview"
                  ? "border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/20"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Eye size={20} />
              <span className="font-bold tracking-wide">Live Preview</span>
              {activeTab === "preview" && (
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-bold border border-blue-500/40 shadow-lg shadow-blue-500/20 animate-pulse">
                  Active
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-300 ${
                activeTab === "code"
                  ? "border-purple-500 bg-purple-500/10 text-white shadow-lg shadow-purple-500/20"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Code size={20} />
              <span className="font-bold tracking-wide">Code Editor</span>
              {activeTab === "code" && (
                <span className="px-2.5 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full font-bold border border-purple-500/40 shadow-lg shadow-purple-500/20 animate-pulse">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "preview" ? <LivePreview /> : <CodeEditor />}
          </div>
        </div>
      </div>
    </div>
  );
}
