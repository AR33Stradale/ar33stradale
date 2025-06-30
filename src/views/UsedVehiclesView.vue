<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Used Vehicles for Sale</h2>

    <div class="mt-8">
      <div class="p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Vehicles Available for Sale</h2>
        <p v-if="loading" class="text-blue-500 text-lg">Loading vehicles...</p>
        <p v-else-if="error" class="text-red-600 text-lg">Error: {{ error }}</p>
        <ul v-else-if="vehicles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <li v-for="vehicle in vehicles" :key="vehicle.id" class="border border-gray-200 p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div v-if="session && editingVehicleId === vehicle.id && session.user.id === vehicle.user_id">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Edit Vehicle</h3>
              <form @submit.prevent="updateVehicle" class="grid grid-cols-1 gap-2">
                <div>
                  <label for="editMake" class="block text-sm font-medium text-gray-700">Make</label>
                  <input type="text" id="editMake" v-model="editedMake" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>
                <div>
                  <label for="editModel" class="block text-sm font-medium text-gray-700">Model</label>
                  <input type="text" id="editModel" v-model="editedModel" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>
                <div>
                  <label for="editYear" class="block text-sm font-medium text-gray-700">Year</label>
                  <input type="number" id="editYear" v-model="editedYear" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>
                <div>
                  <label for="editPrice" class="block text-sm font-medium text-gray-700">Price</label>
                  <input type="number" id="editPrice" v-model="editedPrice" required step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>
                <div>
                  <label for="editMileage" class="block text-sm font-medium text-gray-700">Mileage (km)</label>
                  <input type="number" id="editMileage" v-model="editedMileage" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>
                <div>
                  <label for="editImageUrl" class="block text-sm font-medium text-gray-700">Main Image URL</label>
                  <input type="url" id="editImageUrl" v-model="editedImageUrl" placeholder="e.g., https://your-supabase-url/storage/..." class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>

                <div class="col-span-1 mt-2">
                  <p v-if="editFormError" class="text-red-600 text-sm mb-2">{{ editFormError }}</p>
                  <button
                    type="submit"
                    :disabled="updatingVehicle"
                    class="w-full inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {{ updatingVehicle ? 'Saving...' : 'Save' }}
                  </button>
                  <button
                    type="button"
                    @click="cancelEdit"
                    class="w-full inline-flex justify-center py-1 px-3 mt-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div v-else>
              <h3 class="text-xl font-semibold text-gray-800">{{ vehicle.make }} {{ vehicle.model }} ({{ vehicle.year }})</h3>
              <p class="text-gray-700 mt-1">${{ vehicle.price ? vehicle.price.toLocaleString() : 'N/A' }}</p>
              <p class="text-sm text-gray-500">{{ vehicle.mileage ? vehicle.mileage.toLocaleString() + ' km' : 'N/A' }}</p>
              <img v-if="vehicle.main_image_url" :src="vehicle.main_image_url" :alt="`${vehicle.make} ${vehicle.model}`" class="mt-4 w-full h-48 object-cover rounded-md border border-gray-100">
              <p v-else class="text-sm text-gray-400 mt-2">No image available</p>

              <div v-if="session && session.user.id === vehicle.user_id" class="mt-4 flex space-x-2">
                <button
                  @click="startEditing(vehicle)"
                  class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  @click="deleteVehicle(vehicle.id)"
                  class="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="text-gray-600 text-lg">No vehicles found in the database. Add some via Supabase dashboard!</p>
      </div>

      <div v-if="session" class="p-6 bg-white rounded-lg shadow-md mt-8">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Add New Vehicle</h2>
        <form @submit.prevent="addVehicle" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-1">
            <label for="make" class="block text-sm font-medium text-gray-700">Make</label>
            <input type="text" id="make" v-model="newMake" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="col-span-1">
            <label for="model" class="block text-sm font-medium text-gray-700">Model</label>
            <input type="text" id="model" v-model="newModel" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="col-span-1">
            <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
            <input type="number" id="year" v-model="newYear" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="col-span-1">
            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" id="price" v-model="newPrice" required step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="col-span-1">
            <label for="mileage" class="block text-sm font-medium text-gray-700">Mileage (km)</label>
            <input type="number" id="mileage" v-model="newMileage" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="col-span-1">
            <label for="imageUrl" class="block text-sm font-medium text-gray-700">Main Image URL</label>
            <input type="url" id="imageUrl" v-model="newImageUrl" placeholder="e.g., https://your-supabase-url/storage/..." class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="col-span-full mt-4">
            <p v-if="formError" class="text-red-600 text-sm mb-2">{{ formError }}</p>
            <button
              type="submit"
              :disabled="addingVehicle"
              class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ addingVehicle ? 'Adding...' : 'Add Vehicle' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient' // Adjust path for UsedVehiclesView

const session = ref(null) // Keep session here as it determines edit/delete visibility
const vehicles = ref([])
const loading = ref(true)
const error = ref(null)

// For adding new vehicles
const newMake = ref('')
const newModel = ref('')
const newYear = ref('')
const newPrice = ref('')
const newMileage = ref('')
const newImageUrl = ref('')
const addingVehicle = ref(false)
const formError = ref(null)

// For editing vehicles
const editingVehicleId = ref(null)
const editedMake = ref('')
const editedModel = ref('')
const editedYear = ref('')
const editedPrice = ref('')
const editedMileage = ref('')
const editedImageUrl = ref('')
const updatingVehicle = ref(false)
const editFormError = ref(null)

// --- Functions ---

const fetchVehicles = async () => {
  loading.value = true
  error.value = null
  try {
    const { data, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError
    vehicles.value = data
  } catch (err) {
    console.error('Error fetching vehicles:', err.message)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const addVehicle = async () => {
  addingVehicle.value = true
  formError.value = null
  try {
    if (!session.value || !session.value.user) {
      throw new Error('You must be logged in to add a vehicle.')
    }
    const { data, error: insertError } = await supabase
      .from('vehicles')
      .insert({
        make: newMake.value,
        model: newModel.value,
        year: newYear.value,
        price: newPrice.value,
        mileage: newMileage.value,
        main_image_url: newImageUrl.value,
        user_id: session.value.user.id,
      })
      .select()

    if (insertError) throw insertError

    vehicles.value.unshift(data[0])
    newMake.value = ''
    newModel.value = ''
    newYear.value = ''
    newPrice.value = ''
    newMileage.value = ''
    newImageUrl.value = ''
  } catch (err) {
    console.error('Error adding vehicle:', err.message)
    formError.value = err.message
  } finally {
    addingVehicle.value = false
  }
}

const startEditing = (vehicle) => {
  editingVehicleId.value = vehicle.id
  editedMake.value = vehicle.make
  editedModel.value = vehicle.model
  editedYear.value = vehicle.year
  editedPrice.value = vehicle.price
  editedMileage.value = vehicle.mileage
  editedImageUrl.value = vehicle.main_image_url
  editFormError.value = null
}

const cancelEdit = () => {
  editingVehicleId.value = null
  editFormError.value = null
}

const updateVehicle = async () => {
  updatingVehicle.value = true
  editFormError.value = null
  try {
    if (!session.value || !session.value.user || editingVehicleId.value === null) {
      throw new Error('Not authorized or no vehicle selected for update.')
    }

    const { error: updateError } = await supabase
      .from('vehicles')
      .update({
        make: editedMake.value,
        model: editedModel.value,
        year: editedYear.value,
        price: editedPrice.value,
        mileage: editedMileage.value,
        main_image_url: editedImageUrl.value,
      })
      .eq('id', editingVehicleId.value)
      .eq('user_id', session.value.user.id) // Ensure only owner can update

    if (updateError) throw updateError

    // Update the vehicle in the local array to reflect changes immediately
    const index = vehicles.value.findIndex(v => v.id === editingVehicleId.value)
    if (index !== -1) {
      vehicles.value[index] = {
        ...vehicles.value[index], // Keep other properties
        make: editedMake.value,
        model: editedModel.value,
        year: editedYear.value,
        price: editedPrice.value,
        mileage: editedMileage.value,
        main_image_url: editedImageUrl.value,
      }
    }
    cancelEdit()
  } catch (err) {
    console.error('Error updating vehicle:', err.message)
    editFormError.value = err.message
  } finally {
    updatingVehicle.value = false
  }
}

const deleteVehicle = async (id) => {
  if (!confirm('Are you sure you want to delete this vehicle?')) return

  try {
    if (!session.value || !session.value.user) {
      throw new Error('You must be logged in to delete a vehicle.')
    }
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
      .eq('user_id', session.value.user.id) // Ensure only owner can delete

    if (deleteError) throw deleteError

    vehicles.value = vehicles.value.filter(v => v.id !== id)
  } catch (err) {
    console.error('Error deleting vehicle:', err.message)
    alert('Failed to delete vehicle: ' + err.message)
  }
}

// --- Auth State Management ---
onMounted(() => {
  fetchVehicles(); // Always fetch vehicles on mount

  // Initial session check
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    console.log('UsedVehiclesView.vue: Initial session state after getSession():', session.value);
  })

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
    console.log('UsedVehiclesView.vue: Auth state changed, new session:', _session);
    // If auth state changes (e.g., login/logout), re-fetch vehicles
    fetchVehicles();
  })
})
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
