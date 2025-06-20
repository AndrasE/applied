// src/stores/jobs.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "@/config/firebase";
import type { Job, JobStatus } from "@/types/job";

export const useAppStore = defineStore("app", () => {
  // --- STATE ---
  const jobs = ref<Job[]>([]);
  const jobsDataLoadedInSession = ref(false);
  const isCurrentlyFetching = ref(false);
  const error = ref<string | null>(null);

  // --- LISTENERS ---
  let unsubscribeFirebase: (() => void) | null = null;

  // --- TIMERS ---
  const skeletonMinDuration = 600;
  let snapshotReceivedDuringInitialLoad = false;
  let minTimerDoneDuringInitialLoad = false;

  // --- ACTIONS ---
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

    // Attach the real-time listener
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
  const sortedJobs = computed(() => {
    // Sort jobs based on the 'updatedAt' timestamp in descending order (newest first)
    return [...jobs.value].sort((a, b) => {
      const timeA = a.updatedAt || 0;
      const timeB = b.updatedAt || 0;

      return timeB - timeA;
    });
  });

  return {
    jobs,
    jobsDataLoadedInSession,
    isCurrentlyFetching,
    error,
    ensureJobsListenerActive,
    sortedJobs,
  };
});
