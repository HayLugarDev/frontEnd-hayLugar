import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/main.css';
import VueGoogleMaps from '@fawmi/vue-google-maps';

const app = createApp(App);
app.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAmrMZNbht09n3JRbOqQD002iel4JJZV0E',
      libraries: 'places',
    },
  });
app.use(router);
app.use(createPinia());
app.mount('#app');
