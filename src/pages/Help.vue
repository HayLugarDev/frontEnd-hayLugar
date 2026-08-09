<template>

    <MainHeader />

    <!-- BOTÓN ATRÁS MOBILE -->
    <div class="w-full flex justify-end p-4 sm:hidden fixed top-0 left-0 z-50">
            <BackButton />
    </div>

    <!-- MENÚ INFERIOR MOBILE -->
    <MobileButtonNav @navigate="(p) => router.push(p)" class="md:hidden" :showMap="false" />

    <div class="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] 
              text-white pt-24 md:pt-32 px-8 sm:p-6 max-w-4xl mx-auto">
        <div class="absolute -bottom-40 -left-40 h-56 w-56 blur-3xl rounded-full"></div>

        <div class="relative z-10 space-y-6 text-left">
            <div class="flex flex-col items-center justify-between">
                <h2 class="text-3xl font-bold text-primary">Centro de ayuda</h2>
            </div>
            <p class="text-gray-200 mb-4">
                Todo lo que necesitás saber para usar <span class="font-semibold text-primary">HayLugar</span>
                🚗✨
            </p>

            <!-- Secciones de ayuda -->
            <div class="space-y-8">
                <section>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">👤 Registro e inicio de sesión</h3>
                    <ul class="list-disc ml-5 text-gray-400 space-y-1">
                        <li>Podés registrarte fácilmente con tu cuenta de Google.</li>
                        <li>Una vez registrado, podrás utilizar todas las funciones disponibles.</li>
                    </ul>
                </section>

                <section>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">🅿️ Buscar y reservar espacios</h3>
                    <ul class="list-disc ml-5 text-gray-400 space-y-1">
                        <li>Explorá los diferentes espacios para estacionar publicados por nuestros Anfitriones.
                        </li>
                        <li>Usá el mapa interactivo o el buscador para encontrar espacios de estacionamiento
                            disponibles cerca tuyo.</li>
                        <li>Filtrá por tipo de vehículo, tarifa o disponibilidad horaria.</li>
                        <li>Seleccioná un espacio, elegí el tiempo (hora, día, semana o mes, según
                            disponibilidad) y hacé la solicitud de reserva.</li>
                        <li>Un a vez que el Anfitrión apruebe tu reserva, recibirás un link para abonar la misma
                            a través de la plataforma MercadoPago y ¡Listo! Tu reserva estará confirmada.
                        </li>
                        <li>Recibirás una confirmación por correo electrónico y en la app con los detalles de tu reserva
                            y
                            los pasos para hacer el ingreso en el horario seleccionado.</li>
                        <li class="text-red-300">En caso de ser rechazada la solicitud por parte del Anfitrión, se te
                            informará por los mismos medios.</li>
                    </ul>
                </section>

                <section>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">🏠 Publicar tu propio espacio</h3>
                    <ul class="list-disc ml-5 text-gray-400 space-y-1">
                        <li>Desde la sección <strong>“Publicá tu espacio”</strong> podés agregar un nuevo
                            espacio de estacionamiento.</li>
                        <li>Completá los datos de ubicación, tipo de superficie, días y horarios disponibles,
                            tarifas, fotos.</li>
                        <li>Al confirmar tu publicación, los usuarios ya podrán realizarte solicitudes de
                            reservas, las cuales
                            en tu rol de "Anfitrión" deberás aprobar previamente para poder continuar con el
                            proceso.
                            Recibirás un correo con todos los detalles de la reserva.
                        </li>
                        <li>Podés gestionar tus espacios publicados desde tu perfil, editando detalles o
                            desactivando los mismos.</li>
                    </ul>
                </section>

                <section>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">💳 Pagos y métodos disponibles</h3>
                    <ul class="list-disc ml-5 text-gray-400 space-y-1">
                        <li>Por el momento solo se acepta MercadoPago como método de pago.</li>
                        <li>Podés pagar con tarjeta de crédito o débito.</li>
                        <li>Las transacciones son seguras y protegidas.</li>
                    </ul>
                </section>

                <section>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">🔔 Notificaciones</h3>
                    <ul class="list-disc ml-5 text-gray-400 space-y-1">
                        <li>Recibí alertas en tiempo real dentro de la app a través del ícono de la
                            <strong>campanita</strong> 🔔 ubicado en la parte superior del menú.
                        </li>
                        <li>Las notificaciones te informan sobre <strong>nuevas reservas</strong>,
                            <strong>confirmaciones</strong>, <strong>mensajes importantes</strong> y
                            <strong>actualizaciones de estado</strong>.
                        </li>
                        <li>Podés acceder al historial completo desde la sección <strong>Notificaciones</strong>
                            en tu perfil.</li>
                    </ul>
                </section>


                <section>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">⭐ Favoritos y reseñas</h3>
                    <ul class="list-disc ml-5 text-gray-400 space-y-1">
                        <li>Guardá tus espacios favoritos para acceder a ellos más rápido en futuras reservas.
                        </li>
                        <li>Como <strong>usuario</strong>, podés dejar una reseña y calificar el espacio una vez
                            que finalices tu reserva.</li>
                        <li>Si sos <strong>anfitrión</strong>, podrás calificar al usuario que utilizó tu
                            espacio.</li>
                        <li>Tus opiniones y valoraciones ayudan a fortalecer la comunidad y mejorar la
                            experiencia de todos.</li>
                    </ul>
                </section>

                <section>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">📱 Perfil y configuración</h3>
                    <ul class="list-disc ml-5 text-gray-400 space-y-1">
                        <li>Gestioná toda tu información personal desde tu perfil: nombre, foto, y datos de
                            contacto.</li>
                        <li>Accedé fácilmente a tus <strong>vehículos registrados</strong>, <strong>reservas
                                activas e históricas</strong>, y <strong>publicaciones</strong> como anfitrión.
                        </li>
                        <li>Consultá tus <strong>favoritos</strong> y revisá las <strong>calificaciones</strong>
                            que recibiste o realizaste.</li>
                        <li>Administrá tus <strong>cuentas de cobro</strong> y tu <strong>wallet</strong> para
                            manejar tus ingresos de forma segura.</li>
                    </ul>
                </section>


                <section>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">🧭 Soporte y contacto</h3>
                    <ul class="list-disc ml-5 text-gray-400 space-y-1">
                        <li>Si necesitás ayuda adicional, podés enviar un correo a <span
                                class="text-newgreen font-medium">soportehaylugar@gmail.com</span>.</li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import BackButton from '../components/common/BackButton.vue';

const router = useRouter();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-fade-in {
    animation: fadeIn 0.6s ease forwards;
}

@keyframes fadeIn {
    from {
        transform: translateY(10px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Scroll del modal */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 6px;
}
</style>
