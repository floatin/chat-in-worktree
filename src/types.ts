export type ModeName = "discuss" | "design" | "experiment" | "produce" | "maintain";

export interface ModeConfig {
  name: ModeName;
  skill: string;
  lease: boolean;
  syncTarget: "memory" | "core-files" | "branch" | "branch-or-memory";
  defaultEarlyStop: string;
}

export type SyncTarget = "memory" | "core-file" | "branch" | "discard";

export interface ArtifactMarker {
  sync: boolean;
  target: SyncTarget;
  description?: string;
}

export interface ClassifiedArtifact {
  path: string;
  marker: ArtifactMarker;
  content?: string;
}

export interface SyncPlan {
  memory: ClassifiedArtifact[];
  coreFiles: ClassifiedArtifact[];
  branch: ClassifiedArtifact[];
  discard: ClassifiedArtifact[];
}

export interface FinishPayload {
  mode: ModeName;
  branch?: string;
  artifacts: ClassifiedArtifact[];
  summary: string;
}
