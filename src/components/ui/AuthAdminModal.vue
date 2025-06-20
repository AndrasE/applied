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
};

const checkIfCurrentUserIsAdmin = (user: User | null): boolean => {
  return user ? user.uid === ADMIN_UID : false;
};

const signInAsAdmin = async () => {
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
      authError.value = "This Google account is not authorized as an admin.";
      await auth.signOut();
    }
  } catch (error: any) {
    // Handle errors, including popup-blocked, cancelled, etc.
    if (
      error.code === "auth/popup-closed-by-user" ||
      error.code === "auth/cancelled-popup-request"
    ) {
      authError.value = "Authentication cancelled.";
    } else if (error.code === "auth/popup-blocked") {
      authError.value =
        "Pop-up blocked by your browser. Please enable pop-ups or try again.";
    } else {
      authError.value = `Authentication failed: ${error.message}`;
    }
  }
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
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white p-6 rounded-lg shadow-lg text-center dark:bg-gray-800 dark:text-white">
      <h3 class="text-xl mb-4">Admin Rights Required</h3>
      <p class="mb-4">
        To perform this action, you must sign in with your admin Google account.
      </p>
      <button
        @click="signInAsAdmin"
        class="btn bg-green-600 text-white px-4 py-2 rounded mr-2">
        Sign in with Google
      </button>
      <button
        @click="
          showAuthModal = false;
          pendingAction = null;
        "
        class="btn bg-gray-300 text-gray-800 px-4 py-2 rounded">
        Cancel
      </button>
      <p v-if="authError" class="text-red-500 mt-2">{{ authError }}</p>
    </div>
  </div>
</template>

<style scoped>
.btn {
  cursor: pointer;
}
</style>
