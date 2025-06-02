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
  id: number;
  title: string;
  description: string;
  company: string;
  link: string;
  status?: JobStatus;
  date?: string;
}
