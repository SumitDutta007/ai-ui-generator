"use client";

import { useAppStore } from "@/lib/store";
import { Checkpoint } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Edit2,
  MessageSquare,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function CheckpointTimeline() {
  const {
    checkpoints,
    currentCheckpoint,
    loadCheckpoints,
    restoreCheckpoint,
    deleteCheckpoint,
    updateCheckpointLabel,
    toggleCheckpointMarker,
    iterations,
    loadIterations,
  } = useAppStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [expandedCheckpoints, setExpandedCheckpoints] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    loadCheckpoints();
  }, [loadCheckpoints]);

  const handleEdit = (checkpoint: Checkpoint) => {
    setEditingId(checkpoint.id);
    setEditLabel(checkpoint.label);
  };

  const handleSaveEdit = async () => {
    if (editingId && editLabel.trim()) {
      await updateCheckpointLabel(editingId, editLabel.trim());
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditLabel("");
  };

  const handleRestore = async (checkpointId: string) => {
    await restoreCheckpoint(checkpointId);
  };

  const handleDelete = async (checkpointId: string) => {
    if (confirm("Are you sure you want to delete this checkpoint?")) {
      await deleteCheckpoint(checkpointId);
    }
  };

  const handleToggleMarker = async (checkpointId: string) => {
    await toggleCheckpointMarker(checkpointId);
  };

  const toggleExpand = async (checkpointId: string) => {
    const newExpanded = new Set(expandedCheckpoints);
    if (newExpanded.has(checkpointId)) {
      newExpanded.delete(checkpointId);
    } else {
      newExpanded.add(checkpointId);
      await loadIterations(checkpointId);
    }
    setExpandedCheckpoints(newExpanded);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-900 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Checkpoints</h2>
        <p className="text-xs text-gray-400 mt-1">
          {checkpoints.length} saved versions
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        {checkpoints.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Bookmark size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No checkpoints yet</p>
            <p className="text-xs mt-1">Generate UI to create checkpoints</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkpoints.map((checkpoint, index) => {
              const isActive = currentCheckpoint?.id === checkpoint.id;
              const isExpanded = expandedCheckpoints.has(checkpoint.id);
              const checkpointIterations = iterations.filter(
                (it) => it.parentCheckpointId === checkpoint.id,
              );

              return (
                <div
                  key={checkpoint.id}
                  className={`
                    relative border rounded-lg overflow-hidden transition-all
                    ${
                      isActive
                        ? "border-blue-500 bg-blue-950 shadow-md"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }
                  `}
                >
                  {/* Current Indicator */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
                  )}

                  {/* Checkpoint Content */}
                  <div className="p-3">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <button
                          onClick={() => handleToggleMarker(checkpoint.id)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          {checkpoint.isMarked ? (
                            <BookmarkCheck
                              size={18}
                              className="text-yellow-500"
                            />
                          ) : (
                            <Bookmark size={18} />
                          )}
                        </button>

                        {editingId === checkpoint.id ? (
                          <div className="flex-1 flex items-center space-x-1">
                            <input
                              type="text"
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <h3 className="text-sm font-semibold text-white flex-1">
                            {checkpoint.label}
                          </h3>
                        )}
                      </div>

                      {isActive && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded ml-2">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <p className="text-xs text-gray-400 mb-2">
                      {formatDistanceToNow(checkpoint.timestamp, {
                        addSuffix: true,
                      })}
                    </p>

                    {/* Intent */}
                    <p className="text-xs text-gray-300 mb-3 italic">
                      &quot;{checkpoint.userIntent}&quot;
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {checkpoint.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {checkpoint.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{checkpoint.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRestore(checkpoint.id)}
                        disabled={isActive}
                        className="flex-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                      >
                        <RotateCcw size={12} />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handleEdit(checkpoint)}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1.5 rounded hover:bg-gray-600"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(checkpoint.id)}
                        className="text-xs bg-red-900 text-red-300 px-2 py-1.5 rounded hover:bg-red-800"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Iterations Toggle */}
                    {checkpointIterations.length > 0 && (
                      <button
                        onClick={() => toggleExpand(checkpoint.id)}
                        className="w-full mt-2 text-xs text-gray-400 hover:text-gray-300 flex items-center justify-center space-x-1"
                      >
                        <MessageSquare size={12} />
                        <span>
                          {isExpanded ? "Hide" : "Show"}{" "}
                          {checkpointIterations.length} iteration
                          {checkpointIterations.length !== 1 ? "s" : ""}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Iterations */}
                  {isExpanded && checkpointIterations.length > 0 && (
                    <div className="border-t border-gray-700 bg-gray-900 px-3 py-2 space-y-2">
                      {checkpointIterations.map((iteration) => (
                        <div
                          key={iteration.id}
                          className="text-xs bg-gray-800 border border-gray-700 rounded p-2"
                        >
                          <p className="text-gray-300 italic">
                            &quot;{iteration.userMessage}&quot;
                          </p>
                          <p className="text-gray-500 text-[10px] mt-1">
                            {formatDistanceToNow(iteration.timestamp, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timeline Connector */}
                  {index < checkpoints.length - 1 && (
                    <div className="absolute left-6 -bottom-3 w-0.5 h-3 bg-gray-600"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
