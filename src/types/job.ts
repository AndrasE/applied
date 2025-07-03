// src/types/job.ts
// Job status type: all possible states for a job application
export type JobStatus =
  | "applied"
  | "1st round"
  | "2nd round"
  | "3rd round"
  | "rejected"
  | "no response"
  | "job offer"
  | undefined;

// Job interface: structure for job objects in the app
export interface Job {
  id?: string; // Optional unique identifier
  title: string; // Job title
  company: string; // Company name
  link?: string; // Optional link to job posting
  description: string; // Job description or notes
  status?: JobStatus; // Current status of the job application optional as in add it will be applied
  date?: string; // Date applied or relevant date
  createdAt?: number; // Timestamp when job was created optional as in addview it will be added
  updatedAt?: number; // Timestamp when job was last updated as in addview it empty
}
