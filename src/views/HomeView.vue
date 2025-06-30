<template>
  <div class="home p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Welcome to AR33 Stradale!</h2>
    <p class="text-lg text-gray-600 mb-8">This is your home page content.</p>

    <div v-if="!session" class="mt-8">
      <Auth />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import Auth from '@/components/Auth.vue'

const session = ref(null)

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
/* Add any component-specific styles here if needed */
</style>