// src/stores/jobs.ts (or app.ts, matching your import)
import { defineStore } from "pinia";
import { ref } from "vue";
import { ref as dbRef, onValue } from "firebase/database"; // Import Firebase functions
import { database } from "../config/database"; // Import your Firebase database instance
import type { Job, JobStatus } from "@/types/job"; // Import your Job types

export const useAppStore = defineStore("app", () => {
  // Or 'jobs' for the store ID
  const jobsDataLoadedOnce = ref(false);
  const jobs = ref<Job[]>([]); // Initialize with correct type

  // Internal flags for initial loading sequence within the store
  let snapshotReceivedInternal: boolean = false;
  let minTimerDoneInternal: boolean = false;
  const skeletonMinDuration = 250; // ms

  let unsubscribeFirebase: (() => void) | null = null; // To manage the Firebase listener

  function setJobsDataLoaded() {
    jobsDataLoadedOnce.value = true;
  }

  // Action to fetch jobs and manage the loading state
  function attachAndFetchJobs() {
    // If already loaded in this session, just ensure listener is attached for updates
    if (jobsDataLoadedOnce.value) {
      console.log("🚀 Firebase listener already set up or data loaded.");
      if (!unsubscribeFirebase) {
        // Ensure listener is attached if not already
        const jobsRef = dbRef(database, "jobs");
        unsubscribeFirebase = onValue(
          jobsRef,
          (snapshot) => {
            const jobsData: Job[] = [];
            snapshot.forEach((childSnapshot) => {
              const job = childSnapshot.val();
              jobsData.push({
                ...job,
                id: childSnapshot.key,
                status: job.status as JobStatus,
              });
            });
            jobs.value = jobsData;
            console.log(
              "📥 Fetched jobs from Firebase (subsequent updates):",
              jobsData
            );
          },
          (error) => {
            console.error(
              "Firebase data fetch error on subsequent update:",
              error
            );
          }
        );
      }
      return;
    }

    // --- Logic for the VERY FIRST load in the application session ---
    snapshotReceivedInternal = false;
    minTimerDoneInternal = false;
    jobsDataLoadedOnce.value = false; // Ensure it's false for the initial loading state

    // Start min duration timer
    setTimeout(() => {
      minTimerDoneInternal = true;
      if (snapshotReceivedInternal) {
        jobsDataLoadedOnce.value = true; // Mark as loaded once globally
      }
    }, skeletonMinDuration);

    // Attach Firebase listener
    const jobsRef = dbRef(database, "jobs");
    unsubscribeFirebase = onValue(
      jobsRef,
      (snapshot) => {
        const jobsData: Job[] = [];
        snapshot.forEach((childSnapshot) => {
          const job = childSnapshot.val();
          jobsData.push({
            ...job,
            id: childSnapshot.key,
            status: job.status as JobStatus,
          });
        });
        jobs.value = jobsData;
        snapshotReceivedInternal = true;

        if (minTimerDoneInternal) {
          jobsDataLoadedOnce.value = true; // Mark as loaded once globally
        }
        console.log("📥 Fetched jobs from Firebase (initial load):", jobsData);
      },
      (error) => {
        console.error("Firebase data fetch error:", error);
        jobsDataLoadedOnce.value = true; // Hide skeleton even on error
      }
    );
  }

  // Action to clean up Firebase listener
  function detachFirebaseListener() {
    if (unsubscribeFirebase) {
      unsubscribeFirebase();
      unsubscribeFirebase = null;
      console.log("🔥 Firebase listener detached.");
    }
  }

  return {
    jobsDataLoadedOnce,
    jobs,
    setJobsDataLoaded, // You might not need this if `attachAndFetchJobs` handles it
    attachAndFetchJobs,
    detachFirebaseListener,
  };
});
