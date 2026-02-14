"use client";

import * as UILibrary from "./ui-library";
import { useAppStore } from "@/lib/store";
import { AlertTriangle, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function LivePreview() {
  const { code, setPreviewError } = useAppStore();
  const [PreviewComponent, setPreviewComponent] =
    useState<React.ComponentType | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    const executeCode = () => {
      // Clear previous errors immediately when code changes
      setRenderError(null);
      setPreviewError(null);

      if (!code) {
        setPreviewComponent(null);
        return;
      }

      try {
        // Strip any import/export statements from the code
        const cleanCode = code
          .split("\n")
          .filter((line) => {
            const trimmed = line.trim();
            return (
              !trimmed.startsWith("import ") && !trimmed.startsWith("export ")
            );
          })
          .join("\n");

        console.log("🔍 Executing code:", cleanCode.substring(0, 200) + "...");

        // Create a scope with all available components and React
        const scope = {
          React,
          ...UILibrary,
        };

        // Create the component function from the code (already in React.createElement format)
        const componentFunction = new Function(
          ...Object.keys(scope),
          `
          'use strict';
          ${cleanCode}
          return GeneratedUI;
          `,
        );

        // Execute the function with the scope
        const Component = componentFunction(...Object.values(scope));

        setPreviewComponent(() => Component);
        setPreviewError(null);
        setRenderError(null);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Preview execution error:", error);
        setPreviewError(errorMessage);
        setRenderError(errorMessage);
        setPreviewComponent(null);
      }
    };

    executeCode();
  }, [code, setPreviewError]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Preview Area with Light Background */}
      <div className="flex-1 overflow-auto p-8 bg-linear-to-br from-gray-100 via-white to-gray-50">
        {renderError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md bg-white rounded-xl shadow-lg p-8">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Preview Error
              </h3>
              <p className="text-sm text-gray-600 mb-4">{renderError}</p>
              <div className="text-xs text-left bg-red-50 border border-red-200 rounded-lg p-4 font-mono text-red-800 overflow-auto max-h-40">
                {renderError}
              </div>
            </div>
          </div>
        ) : PreviewComponent ? (
          <ErrorBoundary>
            <div className="min-h-full">
              <PreviewComponent />
            </div>
          </ErrorBoundary>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-white rounded-xl shadow-lg p-12">
              <Eye size={56} className="mx-auto mb-4 text-gray-400" />
              <p className="text-base font-medium text-gray-700">
                No preview available
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Generate code to see live preview
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Preview render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Render Error
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              The generated component encountered an error while rendering.
            </p>
            <div className="text-xs text-left bg-red-50 border border-red-200 rounded p-3 font-mono text-red-800">
              {this.state.error?.message || "Unknown error"}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
