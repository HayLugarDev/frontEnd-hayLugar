import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import landingHayLugar from '../pages/landingHayLugar.vue'
import Help from '../pages/Help.vue'
import FAQView from '../pages/FAQView.vue'
import CookiesPolicy from '../pages/CookiesPolicy.vue'
import PrivacyPolicyView from '../pages/PrivacyPolicyView.vue'
import termsConditions from '../pages/termsConditions.vue'

const TermsPage = () => import('../pages/TermsPage.vue')
const AcceptTerms = () => import('../pages/AcceptTerms.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'landing', component: landingHayLugar },

  // ✅ Rutas de Términos y Condiciones
  { path: '/terminos-y-condiciones', name: 'terms', component: TermsPage },
  { path: '/aceptar-terminos', name: 'accept-terms', component: AcceptTerms },
  { path: '/FAQView', name: 'FAQView', component: FAQView },
  { path: '/cookies', name: 'cookies', component: CookiesPolicy }, 
  { path: '/PrivacyPolicy', name: 'PrivacyPolicyView', component: PrivacyPolicyView },
  { path: '/termsConditions', name: 'termsConditions', component: termsConditions },
  { path: '/help', name: 'Help', component: Help },

]


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
