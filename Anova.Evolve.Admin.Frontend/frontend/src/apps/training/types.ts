export interface TrainingVideo {
  created: string | null; // Date string
  modified: string | null; // Date string
  file: string | null;
  id: number;
  name: string;
  order: number | null;
  photo: string | null;
  slug: string | null;
  summary: string | null;
}

export interface GetTrainingVideosResponse {
  count: number;
  current: number;
  next: string | null;
  page_size: number;
  previous: string | null;
  results: TrainingVideo[];
}
