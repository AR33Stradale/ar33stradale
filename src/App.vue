<template>
  <div class="relative min-h-screen">
    <div class="fixed inset-0 overflow-hidden -z-10">
      <video
        autoplay
        loop
        muted
        playsinline
        class="min-w-full min-h-full object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <source src="/videos/background.webm" type="video/webm">
        <source src="/videos/background.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div class="absolute inset-0 bg-black opacity-50"></div>
    </div>

    <div class="relative z-0 min-h-screen flex flex-col">
      <nav class="bg-gradient-to-r from-gray-900 to-black text-white p-4 shadow-xl">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <router-link to="/" class="text-3xl font-extrabold text-white hover:text-gray-200 transition-colors duration-300 mb-4 md:mb-0">
            <img src="/images/your-logo.png" alt="AR33 Stradale Logo" class="h-12 w-auto inline-block mr-3" />
            AR33 Stradale
          </router-link>

          <div class="flex flex-col md:flex-row md:space-x-6 items-center text-lg font-medium">
            <router-link
              to="/"
              class="nav-link py-2 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 mb-2 md:mb-0"
              active-class="bg-blue-600 text-white"
            >Home</router-link>
            <router-link
              to="/about"
              class="nav-link py-2 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 mb-2 md:mb-0"
              active-class="bg-blue-600 text-white"
            >About</router-link>
            <router-link
              to="/services"
              class="nav-link py-2 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 mb-2 md:mb-0"
              active-class="bg-blue-600 text-white"
            >Services</router-link>
            <router-link
              to="/used-vehicles"
              class="nav-link py-2 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 mb-2 md:mb-0"
              active-class="bg-blue-600 text-white"
            >Used Vehicles</router-link>
            <router-link
              to="/contact"
              class="nav-link py-2 px-4 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 mb-2 md:mb-0"
              active-class="bg-blue-600 text-white"
            >Contact</router-link>

            <div v-if="session" class="mt-2 md:mt-0">
              <button
                @click="signOut"
                class="nav-link py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
              >Sign Out</button>
            </div>
            <div v-else class="mt-2 md:mt-0">
              <router-link
                to="/auth"
                class="nav-link py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
              >Login/Register</router-link>
            </div>
          </div>
        </div>
      </nav>

      <main class="flex-grow p-6">
        <div class="container mx-auto text-white">
          <router-view />
        </div>
      </main>

      <footer class="bg-black bg-opacity-70 text-white p-4 mt-8">
        <div class="container mx-auto text-center text-sm">
          &copy; {{ currentYear }} AR33 Stradale. All rights reserved.
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
// ... (script setup content from before, including imports for ref, onMounted, supabase, session, signOut, currentYear) ...
import { ref, onMounted } from 'vue';
import { supabase } from './lib/supabaseClient'; // Ensure this path is correct

const session = ref(null);
const currentYear = ref(new Date().getFullYear());

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error signing out:', error.message);
  // Optional: Redirect to home or login page after sign out, if desired
  // router.push('/');
};
</script>

<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Prevent horizontal scrollbar from video */
}

/* Base styling for router-links to ensure consistency */
.nav-link {
  display: block; /* Makes full link clickable area for vertical stacking */
  text-align: center; /* Centers text for vertical stacking */
  white-space: nowrap; /* Prevents text from wrapping */
}

/* We don't need extensive custom CSS if we're using Tailwind extensively,
   but you can add specific overrides here if necessary. */
</style>
