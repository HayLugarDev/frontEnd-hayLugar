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
import FAQView from '../pages/FAQView.vue'
import CookiesPolicy from '../pages/CookiesPolicy.vue'
import PrivacyPolicyView from '../pages/PrivacyPolicyView.vue'
import termsConditions from '../pages/termsConditions.vue'
import EventDashboard from '../pages/EventDashboard.vue'
import EventDetail from '../pages/EventDetail.vue'
import ReservationQR from '../pages/ReservationQR.vue'
import ImpactDashboard from '../pages/ImpactDashboard.vue'
import IndustrialDashboard from '../pages/IndustrialDashboard.vue'
import AdminPage from '../pages/AdminPage.vue'
import PlayaDashboard from '../pages/PlayaDashboard.vue'
import PersonalProfile from '../pages/PersonalProfile.vue'
import OwnerProfile from '../pages/OwnerProfile.vue'
import ReservationIncoming from '../pages/ReservationIncoming.vue'
import OwnerPublications from '../pages/OwnerPublications.vue'
import UserVehicles from '../pages/UserVehicles.vue'
import Wallet from '../pages/wallet.vue'
import PayoutAccounts from '../pages/PayoutAccounts.vue'
import IndustrialDetail from '../pages/IndustrialDetail.vue'
import IndustrialSpaceCreate from '../pages/IndustrialSpaceCreate.vue'
import IndustrialParkCreate from '../pages/IndustrialParkCreate.vue'
import IndustrialReservation from '../pages/IndustrialReservation.vue'

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
  { path: '/FAQView', name: 'FAQView', component: FAQView },
  { path: '/cookies', name: 'cookies', component: CookiesPolicy }, 
  { path: '/PrivacyPolicy', name: 'PrivacyPolicyView', component: PrivacyPolicyView },
  { path: '/termsConditions', name: 'termsConditions', component: termsConditions },


  { path: '/add-space', component: addSpace, meta: { requiresAuth: true } },
  { path: '/espacio/:slug', component: detailSpace },
  { path: '/pago', component: payment, meta: { requiresAuth: true } },
  { path: '/confirmacion', component: confirmaReserva, meta: { requiresAuth: true } },
  { path: '/profile', component: profile, meta: { requiresAuth: true } },
  { path: '/personal-profile-user', component: PersonalProfile, meta: { requiresAuth: true } },
  { path: '/personal-profile-owner', component: OwnerProfile, meta: { requiresAuth: true } },
  { path: '/personal-wallet-user', component: Wallet, meta: { requiresAuth: true } },
  { path: '/personal-accounts-user', component: PayoutAccounts, meta: { requiresAuth: true } },
  { path: '/notifications', component: Notifications, meta: { requiresAuth: true } },
  { path: '/add-vehicle', component: AddVehicle, meta: { requiresAuth: true } },
  { path: '/help', component: Help, meta: { requiresAuth: false } },
  { path: '/owner/mypublications', name: 'publications', component: OwnerPublications, meta: { requiresAuth: true } },
  { path: '/owner/reservation-incoming', name: 'reservation-incoming', component: ReservationIncoming, meta: { requiresAuth: true } },
  { path: '/vehicles/user-vehicles', name: 'user-vehicles', component: UserVehicles,  meta: { requiresAuth: true } },
  
  
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

  { path: '/events', component: EventDashboard, meta: { requiresAuth: false } },
{
  path: '/events/:id',
  name: 'EventDetail',
  component: EventDetail,
  meta: { requiresAuth: true },
  props: true, // 👈 habilita recibir "id" como prop
},
{ path: '/industrial/new-park', component: IndustrialParkCreate },
{ path: '/industrial/new-space', component: IndustrialSpaceCreate },
{
  path: '/industrial/:slug',
  name: 'IndustrialDetail',
   component: IndustrialDetail
},
{
  path: '/industrial/:slug/industrial-reservation',
  name: 'IndustrialReservatio',
   component: IndustrialReservation
},


{ path: '/event-qr/:token', name: 'ReservationQR', component: ReservationQR },

{ path: '/impact-dashboard', name: 'ImpactDashboard', component: ImpactDashboard },

{ path: '/industrial-dashboard', name: 'IndustrialDashboard', component:IndustrialDashboard },

{ path: '/playa-dashboard', name: 'PlayaDashboard', component:PlayaDashboard },

// Admin Page
{ path: '/admin-page', name: 'adminPage', component: AdminPage, meta: { requiresAuth: true } },


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
