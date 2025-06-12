// src/types/job.ts
export type JobStatus =
  | "applied"
  | "1st round"
  | "2nd round"
  | "3rd round"
  | "rejected"
  | "no response"
  | "job offer"
  | undefined;

export interface Job {
  title: string;
  description: string;
  company: string;
  status?: JobStatus;
  date?: string;
}
