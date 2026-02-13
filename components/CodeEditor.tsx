"use client";

import { useAppStore } from "@/lib/store";
import Editor from "@monaco-editor/react";
import { AlertCircle, Code2, Eye } from "lucide-react";
import React from "react";

export default function CodeEditor() {
  const { code, setCode, isCodeManuallyEdited, previewError } = useAppStore();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value, true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 size={20} className="text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Generated Code</h2>
          {isCodeManuallyEdited && (
            <span className="text-xs bg-yellow-900 text-yellow-200 px-2 py-0.5 rounded">
              Manually Edited
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Eye size={16} />
          <span>Live preview below</span>
        </div>
      </div>

      {/* Error Banner */}
      {previewError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 flex items-start space-x-2">
          <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Preview Error</p>
            <p className="text-xs text-red-600 mt-0.5">{previewError}</p>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        {code ? (
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Code2 size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No code generated yet</p>
              <p className="text-xs mt-1">
                Start a conversation to generate UI
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
