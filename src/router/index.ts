import { createRouter, createWebHistory } from 'vue-router'
import QuestionaireView from '../views/QuestionaireView.vue'
import HomeView from '../views/HomeView.vue'
import TrendingView from '@/views/TrendingView.vue'
import SearchView from '@/views/SearchView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { useNavigationStore } from '@/stores/counter'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/questionaire',
      name: 'questionaire',
      component: QuestionaireView,
    },
    { path: '/trending', name: 'Trending', component: TrendingView },
    { path: '/search', name: 'Search', component: SearchView },
    { path: '/settings', name: 'Settings', component: SettingsView },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/onboard',
      name: 'onboard',
      component: () => import('../views/Onboarding.vue'),
    },
  ],
})


router.beforeEach((to, from, next) => {
  const navStore = useNavigationStore()

  if (from.name) {
    navStore.setPrevious(from)
  }
  next()
})

export default router
