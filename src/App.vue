<script setup lang="ts">
import Navbar from "@/components/ui/Navbar.vue";
import NavPopup from "./components/ui/NavPopup.vue";
import AuthAdminModal from "@/components/ui/AuthAdminModal.vue";
import { ref, provide } from "vue";
import { RouterView } from "vue-router";
import { auth, database } from "@/config/firebase";

const navPopupRef = ref<InstanceType<typeof NavPopup> | null>(null);
const authModalRef = ref<InstanceType<typeof AuthAdminModal> | null>(null);

const handleGlobalPopup = () => {
  if (navPopupRef.value) {
    navPopupRef.value.openPopup();
  }
};

// Provide the already initialized 'auth' instance and database
provide("firebaseAuthInstance", auth);
provide("firebaseDatabaseInstance", database); // Providing database too for JobDetails
provide("openAdminAuthModal", (actionCallback: () => Promise<void>) => {
  authModalRef.value?.open(actionCallback);
});
provide("checkIfCurrentUserIsAdmin", () => {
  // Pass the auth.currentUser to the modal's internal check
  return (
    authModalRef.value?.checkIfCurrentUserIsAdmin(auth.currentUser) || false
  );
});
</script>

<template>
  <Navbar @open-popup="handleGlobalPopup" />
  <NavPopup ref="navPopupRef" />
  <AuthAdminModal ref="authModalRef" />
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </RouterView>
</template>
