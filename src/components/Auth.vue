<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient' // Adjust this path if supabaseClient.js is elsewhere

const email = ref('')
const password = ref('') // Optional, if using password-based auth
const loading = ref(false)
const emailSent = ref(false)
const loginError = ref(null)

const handleLogin = async (isSignUp) => {
  try {
    loading.value = true
    loginError.value = null // Clear previous errors

    const { error } = isSignUp
      ? await supabase.auth.signUp({
          email: email.value,
          password: password.value,
        })
      : await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        })

    if (error) throw error

    emailSent.value = true
    // If it's a signup, Supabase sends a confirmation email.
    // If it's a signin, the user is logged in directly (unless email confirmation is required and not done yet).
    // For passwordless/OTP, emailSent.value would indicate the magic link sent.
    console.log(isSignUp ? 'Signup successful (check email for confirmation if required)!' : 'Login successful!');

  } catch (error) {
    if (error.message.includes("Email rate limit exceeded")) {
      loginError.value = "Too many requests. Please wait a moment and try again.";
    } else if (error.message.includes("Email not confirmed")) {
      loginError.value = "Please confirm your email address to log in.";
    } else if (error.message.includes("Invalid login credentials")) {
      loginError.value = "Invalid email or password.";
    } else {
      loginError.value = error.message;
    }
    console.error('Auth error:', error.message);
    emailSent.value = false; // Reset if error occurred
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-xl">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or <a href="#" class="font-medium text-blue-600 hover:text-blue-500">create a new one</a>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Email address"
              v-model="email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Password"
              v-model="password"
            />
          </div>
        </div>

        <div v-if="emailSent" class="text-green-600 text-center text-sm">
          Check your email for the login link or confirmation!
        </div>
        <div v-if="loginError" class="text-red-600 text-center text-sm">
          {{ loginError }}
        </div>

        <div>
          <button
            type="button"
            @click="handleLogin(false)"
            :disabled="loading"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Sign in' }}
          </button>
        </div>
        <div>
          <button
            type="button"
            @click="handleLogin(true)"
            :disabled="loading"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Sign up' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>