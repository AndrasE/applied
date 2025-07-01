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
  id?: string;
  title: string;
  company: string;
  link?: string;
  description: string;
  status?: JobStatus;
  date?: string;
  createdAt: number;
  updatedAt?: number;
}
