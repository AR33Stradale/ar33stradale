// Add this import at the top if it's not already there
import { supabase } from '@/lib/supabaseClient' 

// ... other imports ...
import { createRouter, createWebHistory } from 'vue-router'


// Import all your view components
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import UsedVehiclesView from '../views/UsedVehiclesView.vue' // Our new main vehicle list page
import VintageLayout from '../views/VintageLayout.vue' // Layout for vintage sub-pages
import OldTimersView from '../views/OldTimersView.vue'
import YoungTimersView from '../views/YoungTimersView.vue'
import ServicesLayout from '../views/ServicesLayout.vue' // Layout for services sub-pages
import TuningView from '../views/TuningView.vue'
import RestorationInteriorView from '../views/RestorationInteriorView.vue'
import RestorationExteriorView from '../views/RestorationExteriorView.vue'
import TransportView from '../views/TransportView.vue'
import ContactView from '../views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/used-vehicles',
      name: 'used-vehicles',
      component: () => import('../views/UsedVehiclesView.vue'),
      beforeEnter: async (to, from, next) => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          next() // Allow navigation if session exists
        } else {
          next('/') // Redirect to home if no session
        }
      }
    },
    // Vintage sub-routes
    {
      path: '/vintage',
      name: 'vintage',
      component: () => import('../views/VintageLayout.vue'), // Or a parent component for vintage
      children: [
        {
          path: 'old-timers',
          name: 'old-timers',
          component: () => import('../views/OldTimersView.vue')
        },
        {
          path: 'young-timers',
          name: 'young-timers',
          component: () => import('../views/YoungTimersView.vue')
        }
      ]
    },
    // Services sub-routes
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesLayout.vue'), // Or a parent component for services
      children: [
        {
          path: 'tuning',
          name: 'tuning',
          component: () => import('../views/TuningView.vue')
        },
        {
          path: 'restoration-interior',
          name: 'restoration-interior',
          component: () => import('../views/RestorationInteriorView.vue')
        },
        {
          path: 'restoration-exterior',
          name: 'restoration-exterior',
          component: () => import('../views/RestorationExteriorView.vue')
        },
        {
          path: 'transport',
          name: 'transport',
          component: () => import('../views/TransportView.vue')
        }
      ]
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    }
  ]
})

export default router
