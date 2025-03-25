import { createRouter, createWebHistory, RouteRecordRaw  } from 'vue-router';
import login from '../pages/login.vue';
import dashboard from '../pages/dashboard.vue';
import register from '../pages/register.vue';
import addSpace from '../pages/addSpace.vue';
import detailSpace from '../pages/detailSpace.vue';
import checkout from '../pages/checkout.vue';
import payment from '../pages/payment.vue';
import confirmaReserva from '../pages/confirmaReserva.vue';
import profile from '../pages/profile.vue';
import { useUserStore } from '../store/userStore';

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: login },
    { path: '/register', component: register },
    { path: '/dashboard', component: dashboard },
    { path: '/add-space', component: addSpace, meta: { requiresAuth: true }},
    { path: '/espacio/:id', component: detailSpace },
    { path: '/reserva/:id', component: checkout },
    { path: '/pago', component: payment, meta: { requiresAuth: true }},
    { path: '/confirmacion', component: confirmaReserva, meta: { requiresAuth: true }},
    { path: '/profile', component: profile, meta: { requiresAuth: true } },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  
  const userStore = useUserStore();

  console.log('🔹 Ruta solicitada:', to.path);
  console.log('🔹 Requiere autenticación:', to.meta.requiresAuth || 'false');
  console.log('🔹 Token actual:', userStore.token);

  if (to.meta.requiresAuth && !userStore.token) {
    console.log('🔹 Activando sesión expirada y bloqueando navegación');
    return;
  }

  next(); // Permitir navegación si el usuario está autenticado
});

export default router;
