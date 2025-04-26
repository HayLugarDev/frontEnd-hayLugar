import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/main.css';
import 'flowbite';
import VueGoogleMaps from '@fawmi/vue-google-maps';
// Importa la librería y los iconos que necesites
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Iconos sólidos
import { fab } from '@fortawesome/free-brands-svg-icons'; // Iconos de marcas
import { far } from '@fortawesome/free-regular-svg-icons'; // Iconos regulares


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


library.add(fas, fab, far);
const app = createApp(App);
app.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAmrMZNbht09n3JRbOqQD002iel4JJZV0E',
      libraries: 'places',
    },
  });
app.use(router);
app.use(createPinia());
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
