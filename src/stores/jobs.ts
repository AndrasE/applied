// src/stores/jobs.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "@/config/firebase";
import type { Job, JobStatus } from "@/types/job";

// Pinia store for managing job data and Firebase real-time updates
export const useAppStore = defineStore("app", () => {
  // --- STATE ---
  // jobs: array of job objects fetched from Firebase
  const jobs = ref<Job[]>([]);
  // jobsDataLoadedInSession: tracks if jobs have been loaded at least once in this session
  const jobsDataLoadedInSession = ref(false);
  // isCurrentlyFetching: true while fetching/loading jobs
  const isCurrentlyFetching = ref(false);
  // error: holds any error message from Firebase
  const error = ref<string | null>(null);

  // --- LISTENERS ---
  // unsubscribeFirebase: function to detach the Firebase listener
  let unsubscribeFirebase: (() => void) | null = null;

  // --- TIMERS ---
  // skeletonMinDuration: minimum time to show loading skeleton (ms)
  const skeletonMinDuration = 600;
  // snapshotReceivedDuringInitialLoad: tracks if data snapshot was received during initial load
  let snapshotReceivedDuringInitialLoad = false;
  // minTimerDoneDuringInitialLoad: tracks if minimum skeleton timer is done
  let minTimerDoneDuringInitialLoad = false;

  // --- ACTIONS ---
  // Ensure the Firebase jobs listener is attached (idempotent)
  const ensureJobsListenerActive = () => {
    if (unsubscribeFirebase !== null) {
      console.log("🚀 Firebase listener already active. No new fetch needed.");
      return;
    }

    if (isCurrentlyFetching.value) {
      console.log("⏳ Fetch already in progress, skipping duplicate call.");
      return;
    }

    isCurrentlyFetching.value = true;
    error.value = null;

    snapshotReceivedDuringInitialLoad = false;
    minTimerDoneDuringInitialLoad = false;

    setTimeout(() => {
      minTimerDoneDuringInitialLoad = true;
      if (snapshotReceivedDuringInitialLoad) {
        isCurrentlyFetching.value = false;
      }
    }, skeletonMinDuration);

    console.log("🔥 Attaching persistent Firebase jobs listener...");
    const jobsRef = dbRef(database, "jobs");

    // Attach the real-time listener to the jobs node in Firebase
    unsubscribeFirebase = onValue(
      jobsRef,
      (snapshot) => {
        const fetchedJobs: Job[] = [];
        snapshot.forEach((childSnapshot) => {
          const job = childSnapshot.val();
          fetchedJobs.push({
            ...job,
            id: childSnapshot.key,
            status: job.status as JobStatus,
          });
        });
        jobs.value = fetchedJobs;
        jobsDataLoadedInSession.value = true;

        // Handle loading state and skeleton timing
        if (
          !snapshotReceivedDuringInitialLoad &&
          !minTimerDoneDuringInitialLoad
        ) {
          snapshotReceivedDuringInitialLoad = true;
          if (minTimerDoneDuringInitialLoad) {
            isCurrentlyFetching.value = false;
          }
        } else {
          isCurrentlyFetching.value = false;
        }
        console.log(
          "📥 Jobs data updated from Firebase (initial or real-time):",
          fetchedJobs
        );
      },
      (err) => {
        console.error("Firebase data fetch error:", err);
        error.value = err.message;
        isCurrentlyFetching.value = false;
      }
    );
  };

  // --- GETTERS ---
  // sortedJobs: jobs sorted by updatedAt (newest first)
  const sortedJobs = computed(() => {
    // Sort jobs based on the 'updatedAt' timestamp in descending order (newest first)
    return [...jobs.value].sort((a, b) => {
      const timeA = a.updatedAt || 0;
      const timeB = b.updatedAt || 0;
      return timeB - timeA;
    });
  });

  // Expose state, actions, and getters for use in components
  return {
    jobs,
    jobsDataLoadedInSession,
    isCurrentlyFetching,
    error,
    ensureJobsListenerActive,
    sortedJobs,
  };
});
