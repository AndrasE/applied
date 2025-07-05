<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getAuth, // Firebase: get the Auth instance
  GoogleAuthProvider, // Firebase: Google OAuth provider
  signInWithPopup, // Firebase: sign in with Google popup
  onAuthStateChanged, // Firebase: listen for auth state changes
  setPersistence, // Firebase: set session persistence
  browserSessionPersistence, // Firebase: session-only persistence
} from "firebase/auth";
import type { User } from "firebase/auth";
import RouterButton from "./RouterButton.vue";

// Import the Firebase auth instance
const auth = getAuth();

// Modal state: controls visibility and error messages
const showAuthModal = ref(false);
const authError = ref<string | null>(null);
const pendingAction = ref<(() => Promise<void>) | null>(null);

// Admin UID from environment variable
const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

// Open the modal and set the action to perform after successful admin login
const open = (actionCallback: () => Promise<void>) => {
  pendingAction.value = actionCallback;
  showAuthModal.value = true;
  authError.value = null;
  console.log("🕵️️ Admin login modal opened");
};

// Check if the current user is the admin
const checkIfCurrentUserIsAdmin = (user: User | null): boolean => {
  return user ? user.uid === ADMIN_UID : false;
};

// Sign in as admin using Google popup
const signInAsAdmin = async () => {
  console.log("🕵️️ Attempting to sign in as admin...");

  const provider = new GoogleAuthProvider();
  authError.value = null;

  try {
    // IMPORTANT: Set persistence before calling signInWithPopup
    await setPersistence(auth, browserSessionPersistence);

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (checkIfCurrentUserIsAdmin(user)) {
      console.log(
        "🕵️️ Admin logged in successfully via popup (session-only persistence)!"
      );
      showAuthModal.value = false;
      if (pendingAction.value) {
        await pendingAction.value();
        pendingAction.value = null;
      }
    } else {
      // If not admin, sign out and show error
      console.log("🕵️️ Non-admin user detected, signing out.");
      authError.value = "This Google account is not authorised as an admin.";
      await auth.signOut();
    }
  } catch (error: any) {
    // Handle errors, including popup-blocked, cancelled, etc.
    if (
      error.code === "auth/popup-closed-by-user" ||
      error.code === "auth/cancelled-popup-request"
    ) {
      console.log("❌ User closed or cancelled the authentication popup.");
    } else if (error.code === "auth/popup-blocked") {
      authError.value =
        "Pop-up blocked by your browser. Please enable pop-ups or try again.";
    } else {
      authError.value = `Authentication failed: ${error.message}`;
    }
  }
};

// Handle closing the modal
const handleCancel = () => {
  showAuthModal.value = false;
  pendingAction.value = null;
  console.log("✖️ User closed admin login modal");
};

// On mount, ensure only admin can stay logged in
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    // This listener will still fire on page load/refresh
    if (user && !checkIfCurrentUserIsAdmin(user)) {
      console.warn("🕵️️ Non-admin user session detected, signing out.");
      await auth.signOut();
    }
  });
});

// Expose open and checkIfCurrentUserIsAdmin for parent components
defineExpose({ open, checkIfCurrentUserIsAdmin });
</script>

<template>
  <!-- Admin authentication modal overlay -->
  <div
    v-if="showAuthModal"
    class="fixed inset-0 bg-[var(--popup-opactiy-bg-light)] dark:bg-[var(--popup-opactiy-bg-dark)] bg-opacity-60 flex items-center justify-center z-[1000] p-2">
    <div
      class="text-center flex flex-col items-center justify-center max-w-sm p-2 rounded border border-color bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]">
      <h2 class="mb-4 text-2xl">Hold Up, Wait a Minute</h2>
      <p class="text-sm">
        To perform this action, you must sign in with a Google account that has
        admin privileges.
      </p>
      <!-- Show authentication error if present -->
      <p v-if="authError" class="mt-4 text-sm text-red-500">{{ authError }}</p>
      <div class="flex justify-center gap-4 mt-4">
        <!-- Close button -->
        <RouterButton
          @click="handleCancel"
          label="Close"
          icon="heroicons-solid:x"
          iconPosition="left" />
        <!-- Sign in button -->
        <RouterButton
          @click="signInAsAdmin"
          label="Sign In"
          icon="heroicons:check-solid"
          iconPosition="right" />
      </div>
    </div>
  </div>
</template>
