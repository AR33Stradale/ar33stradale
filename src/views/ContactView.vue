<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
    <p>We'd love to hear from you! Please fill out the form below or reach us through the following methods.</p>
    
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-2xl font-semibold text-gray-700 mb-3">Get in Touch</h3>
        <p class="mb-2"><strong>Email:</strong> info@ar33stradale.com</p>
        <p class="mb-2"><strong>Phone:</strong> +44 1234 567890</p>
        <p class="mb-2"><strong>Address:</strong> 123 Classic Car Lane, Motor City, UK</p>
      </div>
      
      <div>
        <h3 class="text-2xl font-semibold text-gray-700 mb-3">Send us a Message</h3>
        <form class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
          </div>
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <textarea id="message" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"></textarea>
          </div>
          <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// No specific logic needed here for now
</script>

<style scoped>
/* Component specific styles */
</style>