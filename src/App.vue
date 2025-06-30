<template>
  <div id="app-container" class="min-h-screen flex flex-col bg-blue-50">
    <header class="bg-gray-800 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <img alt="Vue logo" class="logo h-12 w-12 mr-4" src="./assets/logo.svg" />
          <span class="text-2xl font-bold">AR33 Stradale</span>
        </div>

        <nav class="flex items-center space-x-4">
          <RouterLink to="/" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</RouterLink>
          <RouterLink to="/about" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</RouterLink>
          <RouterLink to="/used-vehicles" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Used Vehicles</RouterLink>
          
          <div class="relative group">
            <button class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Vintage</button>
            <div class="absolute hidden group-hover:block bg-gray-700 text-white mt-2 py-1 rounded-md shadow-lg z-10 min-w-[150px]">
              <RouterLink to="/vintage/old-timers" class="block px-4 py-2 text-sm hover:bg-gray-600">Old Timers</RouterLink>
              <RouterLink to="/vintage/young-timers" class="block px-4 py-2 text-sm hover:bg-gray-600">Young Timers</RouterLink>
            </div>
          </div>

          <div class="relative group">
            <button class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Services</button>
            <div class="absolute hidden group-hover:block bg-gray-700 text-white mt-2 py-1 rounded-md shadow-lg z-10 min-w-[150px]">
              <RouterLink to="/services/tuning" class="block px-4 py-2 text-sm hover:bg-gray-600">Tuning</RouterLink>
              <RouterLink to="/services/restoration-interior" class="block px-4 py-2 text-sm hover:bg-gray-600">Restoration Interior</RouterLink>
              <RouterLink to="/services/restoration-exterior" class="block px-4 py-2 text-sm hover:bg-gray-600">Restoration Exterior</RouterLink>
              <RouterLink to="/services/transport" class="block px-4 py-2 text-sm hover:bg-gray-600">Transport</RouterLink>
            </div>
          </div>

          <RouterLink to="/contact" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</RouterLink>

          <template v-if="session">
            <span class="text-gray-300 text-sm">Welcome, {{ session.user.email }}</span>
            <button 
              @click="handleLogout" 
              class="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors duration-200"
            >
              Logout
            </button>
          </template>
        </nav>
      </div>
    </header>

    <main class="flex-grow container mx-auto p-6">
      <h1 class="text-3xl font-bold text-red-500 text-center mt-10">AR33 Stradale</h1>

      <RouterView /> 

    </main>

    <footer class="bg-gray-800 text-white p-4 text-center mt-8">
      <div class="container mx-auto">
        <p>&copy; 2025 AR33 Stradale. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient' // Keep supabase import

const session = ref(null)

const handleLogout = async () => {
  try {
    const { error: logoutError } = await supabase.auth.signOut()
    if (logoutError) throw logoutError
    session.value = null // Clear session locally
    console.log('Logged out successfully')
  } catch (err) {
    console.error('Error during logout:', err.message)
  }
}

// --- Auth State Management for header (logout button) ---
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<style scoped>
/* No specific styles needed for App.vue unless it's global */
</style>