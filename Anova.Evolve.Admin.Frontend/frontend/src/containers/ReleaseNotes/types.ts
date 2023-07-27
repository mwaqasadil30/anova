export enum ReleaseNoteType {
  Feature = 'Feature',
  Fix = 'Fix',
}

export interface WorkItem {
  WorkItemId: number;
  WorkItemType: ReleaseNoteType;
  WorkItemReleaseNotes: string;
}

export type ReleaseNoteMapping = Record<string, WorkItem[]>;
