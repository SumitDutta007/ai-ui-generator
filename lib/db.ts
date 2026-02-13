// IndexedDB setup for checkpoint and version storage
import Dexie, { Table } from "dexie";
import { Checkpoint, GenerationSession, Iteration } from "./types";

export class UIGeneratorDB extends Dexie {
  checkpoints!: Table<Checkpoint, string>;
  iterations!: Table<Iteration, string>;
  sessions!: Table<GenerationSession, string>;

  constructor() {
    super("RyzeAI_UIGenerator");

    this.version(1).stores({
      checkpoints: "id, timestamp, isMarked, label",
      iterations: "id, parentCheckpointId, timestamp",
      sessions: "id, startTime",
    });
  }
}

export const db = new UIGeneratorDB();

// Helper functions
export const checkpointHelpers = {
  async create(checkpoint: Checkpoint): Promise<string> {
    return await db.checkpoints.add(checkpoint);
  },

  async getAll(): Promise<Checkpoint[]> {
    return await db.checkpoints.orderBy("timestamp").reverse().toArray();
  },

  async getById(id: string): Promise<Checkpoint | undefined> {
    return await db.checkpoints.get(id);
  },

  async update(id: string, updates: Partial<Checkpoint>): Promise<void> {
    await db.checkpoints.update(id, updates);
  },

  async delete(id: string): Promise<void> {
    // Delete checkpoint and all its iterations
    await db.iterations.where("parentCheckpointId").equals(id).delete();
    await db.checkpoints.delete(id);
  },

  async getMarked(): Promise<Checkpoint[]> {
    return await db.checkpoints.where("isMarked").equals(1).sortBy("timestamp");
  },

  async count(): Promise<number> {
    return await db.checkpoints.count();
  },
};

export const iterationHelpers = {
  async create(iteration: Iteration): Promise<string> {
    return await db.iterations.add(iteration);
  },

  async getByCheckpoint(checkpointId: string): Promise<Iteration[]> {
    return await db.iterations
      .where("parentCheckpointId")
      .equals(checkpointId)
      .sortBy("timestamp");
  },

  async getAll(): Promise<Iteration[]> {
    return await db.iterations.orderBy("timestamp").reverse().toArray();
  },
};

export const sessionHelpers = {
  async create(session: GenerationSession): Promise<string> {
    return await db.sessions.add(session);
  },

  async getAll(): Promise<GenerationSession[]> {
    return await db.sessions.orderBy("startTime").reverse().limit(50).toArray();
  },

  async getById(id: string): Promise<GenerationSession | undefined> {
    return await db.sessions.get(id);
  },
};
