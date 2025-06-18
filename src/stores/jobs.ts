// src/stores/jobs.ts (or app.ts)
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../config/database";
import type { Job, JobStatus } from "@/types/job";

export const useAppStore = defineStore("app", () => {
  const jobs = ref<Job[]>([]);
  const jobsDataLoadedInSession = ref(false); // Indicates if data has *ever* been loaded in this session
  const isCurrentlyFetching = ref(false); // Indicates if an active fetch/listener setup is in progress
  const error = ref<string | null>(null);

  // This will manage the single, persistent unsubscribe function for the Firebase listener.
  // It's initialized to null, and only set once the listener is attached.
  let unsubscribeFirebase: (() => void) | null = null;

  const skeletonMinDuration = 600; // ms
  let snapshotReceivedDuringInitialLoad = false;
  let minTimerDoneDuringInitialLoad = false;

  // --- ACTIONS ---
  // This action will ensure the Firebase listener is attached and persistent.
  // It will only attach if not already active.
  const ensureJobsListenerActive = () => {
    // If the listener is already attached, do nothing. Data is already being kept in sync.
    if (unsubscribeFirebase !== null) {
      console.log("🚀 Firebase listener already active. No new fetch needed.");
      return;
    }

    // If a fetch is already in progress, avoid duplicate calls.
    if (isCurrentlyFetching.value) {
      console.log("⏳ Fetch already in progress, skipping duplicate call.");
      return;
    }

    isCurrentlyFetching.value = true; // Set to true to show skeleton for the initial load
    error.value = null;

    // --- Skeleton Display Logic for the VERY FIRST LOAD IN SESSION ---
    // These flags ensure the skeleton shows for a minimum duration only during the first fetch.
    snapshotReceivedDuringInitialLoad = false;
    minTimerDoneDuringInitialLoad = false;

    setTimeout(() => {
      minTimerDoneDuringInitialLoad = true;
      if (snapshotReceivedDuringInitialLoad) {
        // If snapshot arrived and timer is done, hide skeleton
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
        jobsDataLoadedInSession.value = true; // Mark as loaded for the session

        // Handle skeleton hiding for the initial load
        if (
          !snapshotReceivedDuringInitialLoad &&
          !minTimerDoneDuringInitialLoad
        ) {
          snapshotReceivedDuringInitialLoad = true;
          if (minTimerDoneDuringInitialLoad) {
            isCurrentlyFetching.value = false; // Hide skeleton if duration met
          }
        } else {
          // This is a subsequent real-time update, or initial load already finished its skeleton phase
          isCurrentlyFetching.value = false; // Ensure skeleton is hidden if it wasn't already
        }
        console.log(
          "📥 Jobs data updated from Firebase (initial or real-time):",
          fetchedJobs
        );
      },
      (err) => {
        console.error("Firebase data fetch error:", err);
        error.value = err.message;
        isCurrentlyFetching.value = false; // Hide skeleton on error
        // Optionally: unsubscribeFirebase = null; here if you want to retry attaching on next call
      }
    );
  };

  // --- GETTERS ---
  const sortedJobs = computed(() => {
    return [...jobs.value].reverse();
  });

  return {
    jobs,
    jobsDataLoadedInSession, // Can be used to check if any data is loaded at all
    isCurrentlyFetching, // Use this for skeleton display (true when fetching/initializing)
    error,
    ensureJobsListenerActive, // The key action to call from JobsView
    sortedJobs,
  };
});
