<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import type { User } from "firebase/auth";
import RouterButton from "./RouterButton.vue";

// Import the Firebase auth instance
const auth = getAuth();

const showAuthModal = ref(false);
const authError = ref<string | null>(null);
const pendingAction = ref<(() => Promise<void>) | null>(null);

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

const open = (actionCallback: () => Promise<void>) => {
  pendingAction.value = actionCallback;
  showAuthModal.value = true;
  authError.value = null;
  console.log("🕵️️ Admin login modal opened");
};

const checkIfCurrentUserIsAdmin = (user: User | null): boolean => {
  return user ? user.uid === ADMIN_UID : false;
};

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
      console.log("🕵️️ Non-admin user detected, signing out.");
      authError.value = "This Google account is not authorized as an admin.";
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

const handleCancel = () => {
  showAuthModal.value = false;
  pendingAction.value = null;
  console.log("✖️ User closed admin login modal");
};

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    // This listener will still fire on page load/refresh
    if (user && !checkIfCurrentUserIsAdmin(user)) {
      console.warn("🕵️️ Non-admin user session detected, signing out.");
      await auth.signOut();
    }
  });
});

defineExpose({ open, checkIfCurrentUserIsAdmin });
</script>

<template>
  <div
    v-if="showAuthModal"
    class="fixed inset-0 bg-[var(--popup-opactiy-bg-light)] dark:bg-[var(--popup-opactiy-bg-dark)] bg-opacity-60 flex items-center justify-center z-[1000] p-2">
    <div
      class="text-center flex flex-col items-center justify-center max-w-sm p-2 rounded border border-color bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]">
      <h2 class="text-2xl mb-4">Hold Up, Wait a Minute</h2>
      <p class="text-sm">
        To perform this action, you must sign in with your admin Google account.
      </p>
      <p v-if="authError" class="text-red-500 text-sm mt-4">{{ authError }}</p>
      <div class="flex justify-center gap-4 mt-4">
        <RouterButton
          @click="handleCancel"
          label="Close"
          icon="heroicons-solid:x"
          iconPosition="left" />
        <RouterButton
          @click="signInAsAdmin"
          label="Sign In"
          icon="heroicons:check-solid"
          iconPosition="right" />
      </div>
    </div>
  </div>
</template>
