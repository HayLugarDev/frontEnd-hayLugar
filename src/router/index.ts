// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import login from '../pages/login.vue'
import dashboard from '../pages/dashboard.vue'
import register from '../pages/register.vue'
import GoogleSuccess from '../pages/googleSuccess.vue'
import addSpace from '../pages/addSpace.vue'
import detailSpace from '../pages/detailSpace.vue'
import payment from '../pages/payment.vue'
import confirmaReserva from '../pages/confirmaReserva.vue'
import profile from '../pages/profile.vue'
import AddVehicle from '../pages/addVehicle.vue'
import universityDashboard from '../pages/universityDashboard.vue'
import meteredParkingDashboard from '../pages/meteredParkingDashboard.vue'
import Notifications from '../pages/notifications.vue'
import landingHayLugar from '../pages/landingHayLugar.vue'
import Help from '../pages/Help.vue'

// ✅ Nuevas páginas (lazy import recomendado para reducir bundle):
const TermsPage = () => import('../pages/TermsPage.vue')
const AcceptTerms = () => import('../pages/AcceptTerms.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'landing', component: landingHayLugar },
  { path: '/login', name: 'login', component: login },
  { path: '/register', component: register },
  { path: '/google-success', name: 'GoogleSuccess', component: GoogleSuccess },
  { path: '/dashboard', component: dashboard },

  // ✅ Rutas de Términos y Condiciones
  { path: '/terminos-y-condiciones', name: 'terms', component: TermsPage },
  { path: '/aceptar-terminos', name: 'accept-terms', component: AcceptTerms },

  { path: '/add-space', component: addSpace, meta: { requiresAuth: true } },
  { path: '/espacio/:slug', component: detailSpace },
  { path: '/pago', component: payment, meta: { requiresAuth: true } },
  { path: '/confirmacion', component: confirmaReserva, meta: { requiresAuth: true } },
  { path: '/profile', component: profile, meta: { requiresAuth: true } },
  { path: '/notifications', component: Notifications, meta: { requiresAuth: true } },
  { path: '/add-vehicle', component: AddVehicle, meta: { requiresAuth: true } },
  { path: '/help', component: Help, meta: { requiresAuth: false } },

  {
    path: '/universidades',
    name: 'Universities',
    component: universityDashboard,
    meta: { requiresAuth: false },
  },
  {
    path: '/meteredParkingDashboard',
    name: 'meteredParkingDashboard',
    component: meteredParkingDashboard,
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// ✅ Guard global:
// - si llega ?mustReaccept=1 → forzar /aceptar-terminos
// - proteger rutas con meta.requiresAuth
// - soportar redirect post-login
router.beforeEach((to, from, next) => {
  // 1) Forzar flujo de aceptación de T&C si llegó desde OAuth con el flag
  if (to.query.mustReaccept === '1') {
    next({ name: 'accept-terms' })
    return
  }

  next()
})

export default router
