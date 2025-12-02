import { createRouter, createWebHistory } from 'vue-router'
import QuestionaireView from '../views/QuestionaireView.vue'
import HomeView from '../views/HomeView.vue'
import TrendingView from '@/views/TrendingView.vue'
import SearchView from '@/views/SearchView.vue'
import SettingsView from '@/views/SettingsView.vue'
import AddNoteView from '@/views/AddNoteView.vue'
import { useNavigationStore } from '@/stores/counter'
import SingleNoteView from '@/views/SingleNoteView.vue'
import ScriptureView from '@/views/ScriptureView.vue'

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
    { path: '/trending', name: 'trending', component: TrendingView },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/settings', name: 'settings', component: SettingsView },
    { path: '/note', name: 'add-note', component: AddNoteView },
    { path: '/note/:noteId', name: 'view-note', component: SingleNoteView, props: true },
    { path: '/note/scripture', name: 'scripture', component: ScriptureView },
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
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
    },
    {
      path: '/otp',
      name: 'otp',
      component: () => import('../views/OTPView.vue'),
    },
    {
      path: '/new-password',
      name: 'new-password',
      component: () => import('../views/NewPasswordView.vue'),
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
