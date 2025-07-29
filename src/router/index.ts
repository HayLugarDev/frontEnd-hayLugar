import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import login from '../pages/login.vue';
import dashboard from '../pages/dashboard.vue';
import register from '../pages/register.vue';
import GoogleSuccess from '../pages/googleSuccess.vue';
import addSpace from '../pages/addSpace.vue';
import detailSpace from '../pages/detailSpace.vue';
import payment from '../pages/payment.vue';
import confirmaReserva from '../pages/confirmaReserva.vue';
import profile from '../pages/profile.vue';
import wallet from '../pages/wallet.vue';
import { useUserStore } from '../store/userStore';
import AddVehicle from '../pages/addVehicle.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: login },
  { path: '/register', component: register },
  { path: '/google-success', name: 'GoogleSuccess', component: GoogleSuccess },
  { path: '/dashboard', component: dashboard },
  { path: '/add-space', component: addSpace, meta: { requiresAuth: true } },
  { path: '/espacio/:id', component: detailSpace },
  { path: '/pago', component: payment, meta: { requiresAuth: true } },
  { path: '/confirmacion', component: confirmaReserva, meta: { requiresAuth: true } },
  { path: '/profile', component: profile, meta: { requiresAuth: true } },
  { path: '/wallet', component: wallet, meta: { requiresAuth: true } },
  { path: '/add-vehicle', component: AddVehicle, meta: { requiresAuth: true } },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
});

export default router;
