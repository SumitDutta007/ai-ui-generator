// Global state management with Zustand
import { create } from "zustand";
import { checkpointHelpers, iterationHelpers } from "./db";
import { Checkpoint, Iteration, Message } from "./types";

interface AppState {
  // UI State
  currentCheckpoint: Checkpoint | null;
  checkpoints: Checkpoint[];
  iterations: Iteration[];

  // Chat State
  messages: Message[];
  isGenerating: boolean;

  // Editor State
  code: string;
  isCodeManuallyEdited: boolean;

  // Preview State
  previewError: string | null;

  // Actions
  setCurrentCheckpoint: (checkpoint: Checkpoint | null) => void;
  loadCheckpoints: () => Promise<void>;
  addCheckpoint: (checkpoint: Checkpoint) => Promise<void>;
  deleteCheckpoint: (id: string) => Promise<void>;
  updateCheckpointLabel: (id: string, label: string) => Promise<void>;
  toggleCheckpointMarker: (id: string) => Promise<void>;

  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  clearMessages: () => void;

  setCode: (code: string, isManualEdit?: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setPreviewError: (error: string | null) => void;

  restoreCheckpoint: (checkpointId: string) => Promise<void>;

  addIteration: (iteration: Iteration) => Promise<void>;
  loadIterations: (checkpointId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  currentCheckpoint: null,
  checkpoints: [],
  iterations: [],
  messages: [],
  isGenerating: false,
  code: "",
  isCodeManuallyEdited: false,
  previewError: null,

  // Checkpoint Actions
  setCurrentCheckpoint: (checkpoint) => set({ currentCheckpoint: checkpoint }),

  loadCheckpoints: async () => {
    const checkpoints = await checkpointHelpers.getAll();
    set({ checkpoints });
  },

  addCheckpoint: async (checkpoint) => {
    await checkpointHelpers.create(checkpoint);
    const checkpoints = await checkpointHelpers.getAll();
    set({
      checkpoints,
      currentCheckpoint: checkpoint,
      code: checkpoint.code,
    });
  },

  deleteCheckpoint: async (id) => {
    await checkpointHelpers.delete(id);
    const checkpoints = await checkpointHelpers.getAll();
    const current = get().currentCheckpoint;

    set({
      checkpoints,
      currentCheckpoint: current?.id === id ? null : current,
    });
  },

  updateCheckpointLabel: async (id, label) => {
    await checkpointHelpers.update(id, { label });
    const checkpoints = await checkpointHelpers.getAll();
    set({ checkpoints });
  },

  toggleCheckpointMarker: async (id) => {
    const checkpoint = await checkpointHelpers.getById(id);
    if (checkpoint) {
      await checkpointHelpers.update(id, { isMarked: !checkpoint.isMarked });
      const checkpoints = await checkpointHelpers.getAll();
      set({ checkpoints });
    }
  },

  // Message Actions
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  clearMessages: () => set({ messages: [] }),

  // Editor Actions
  setCode: (code, isManualEdit = false) => {
    set({
      code,
      isCodeManuallyEdited: isManualEdit,
      previewError: null,
    });
  },

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setPreviewError: (previewError) => set({ previewError }),

  // Restore Checkpoint
  restoreCheckpoint: async (checkpointId) => {
    const checkpoint = await checkpointHelpers.getById(checkpointId);
    if (checkpoint) {
      set({
        currentCheckpoint: checkpoint,
        code: checkpoint.code,
        isCodeManuallyEdited: false,
        previewError: null,
      });

      // Add system message
      get().addMessage({
        role: "system",
        content: `Restored checkpoint: ${checkpoint.label}`,
      });
    }
  },

  // Iteration Actions
  addIteration: async (iteration) => {
    await iterationHelpers.create(iteration);
    const iterations = await iterationHelpers.getByCheckpoint(
      iteration.parentCheckpointId,
    );
    set({ iterations });
  },

  loadIterations: async (checkpointId) => {
    const iterations = await iterationHelpers.getByCheckpoint(checkpointId);
    set({ iterations });
  },
}));
