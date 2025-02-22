import { createRouter, createWebHistory } from 'vue-router';
import login from '../pages/login.vue';
import dashboard from '../pages/dashboard.vue';
import register from '../pages/register.vue';
import addSpace from '../pages/addSpace.vue';
import detailSpace from '../pages/detailSpace.vue';
import reserva from '../pages/checkout.vue';
import payment from '../pages/payment.vue';
import confirmaReserva from '../pages/confirmaReserva.vue';
import profile from '../pages/profile.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/register', component: register },
    { path: '/dashboard', component: dashboard },
    { path: '/add-space', component: addSpace },
    { path: '/espacio/:id', component: detailSpace },
    { path: '/reserva', component: reserva },
    { path: '/pago', component: payment },
    { path: '/confirmacion', component: confirmaReserva },
    { path: '/profile', component: profile },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
