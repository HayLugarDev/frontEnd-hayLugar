<template>

  <div class="w-full flex justify-end p-4 sm:hidden absolute top-0 left-0 z-50">
    <BackButton />
  </div>

  <MainHeader />
  <div class="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-dark text-white pt-10 md:pt-0">
    <section class="py-16 px-6 text-center max-w-4xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">Política de Privacidad</h1>
      <p class="text-gray-300">Última actualización: <span class="font-semibold">10 de octubre de 2025</span></p>
      <p class="text-gray-300 mt-2 text-sm">
        Esta Política complementa los
        <RouterLink to="/termsConditions" class="text-accent underline">Términos y Condiciones</RouterLink>
        y la
        <RouterLink to="/cookies" class="text-accent underline">Política de Cookies</RouterLink>
        de HayLugar.
      </p>
    </section>

    <section class="bg-white text-gray-800 rounded-t-3xl shadow-2xl py-12 px-6 md:px-10">
      <div class="max-w-3xl mx-auto space-y-10 leading-relaxed">
        <p>
          Esta Política describe cómo <strong>FOUNDAR S.A.S.</strong> (CUIT: <em>30-71910647-8</em>, domicilio:
          <em>Congreso 851 Piso 11</em>) trata tus datos personales al usar <strong>HayLugar</strong>, conforme a la
          <strong>Ley 25.326</strong> y normativa aplicable en la República Argentina.
        </p>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">0. Definiciones</h2>
          <ul class="list-disc ml-6 space-y-1">
            <li><strong>Datos personales:</strong> información que identifica o puede identificar a una persona.</li>
            <li><strong>Tratamiento:</strong> operaciones aplicadas sobre datos (recolección, uso, conservación, etc.).</li>
            <li><strong>Responsable:</strong> quien decide sobre finalidades y medios del tratamiento (FOUNDAR S.A.S.).</li>
            <li><strong>Encargado:</strong> quien trata datos por cuenta del Responsable (p. ej., Mercado Pago, Cloudflare).</li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">1. Información que recopilamos</h2>
          <ul class="list-disc ml-6 space-y-1">
            <li><strong>Identificación:</strong> nombre, apellido, DNI, fecha de nacimiento; perfil Google (si aplica).</li>
            <li><strong>Contacto:</strong> teléfono, e-mail, domicilio (si es necesario).</li>
            <li><strong>Pagos:</strong> gestionados por procesadores autorizados (no almacenamos datos de tarjeta).</li>
            <li><strong>Conducción/vehículo:</strong> licencia (si corresponde), patente, marca/modelo/color.</li>
            <li><strong>Geolocalización:</strong> ubicación en tiempo real (configurable en tu dispositivo).</li>
            <li><strong>Uso:</strong> búsquedas, reservas, transacciones, publicaciones, calificaciones, reclamos.</li>
            <li><strong>De terceros:</strong> reportes de usuarios, requerimientos de autoridades/prestadores.</li>
            <li><strong>Automáticos/cookies:</strong> IP, dispositivo, navegador. Ver <RouterLink to="/cookies" class="text-primary underline">Política de Cookies</RouterLink>.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">2. Finalidades</h2>
          <p>Proveer el servicio, gestionar pagos y reservas, seguridad/fraude, notificaciones, mejoras y cumplimiento legal.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">3. Bases legales</h2>
          <p>Consentimiento, ejecución de contrato, obligaciones legales y legítimo interés (seguridad y mejora del servicio).</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">4. Conservación</h2>
          <ul class="list-disc ml-6 space-y-1">
            <li>Mientras la cuenta esté activa; luego por plazos legales.</li>
            <li>Transacciones/reservas: mínimo 5 años (fiscal).</li>
            <li>Cuentas inactivas: eliminación tras 3 años.</li>
            <li>Backups/logs: periodos razonables de continuidad y seguridad.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">5. Comunicación y transferencias</h2>
          <p>No vendemos ni alquilamos datos. Compartimos con:</p>
          <ul class="list-disc ml-6 space-y-1">
            <li>Procesadores de pago (p. ej., Mercado Pago).</li>
            <li>Proveedores tecnológicos: hosting/infra, CDN/seguridad (Cloudflare), mapas (Google Maps), mensajería, analítica (si aplica).</li>
            <li>Autoridades administrativas o judiciales (cuando lo exige la ley).</li>
            <li>Asesores profesionales bajo confidencialidad.</li>
          </ul>
          <p class="mt-2">
            Puede haber transferencias internacionales bajo <strong>garantías contractuales adecuadas</strong> o hacia países con
            niveles de protección adecuados, alineados a la Ley 25.326 y recomendaciones AAIP.
          </p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">6. Seguridad</h2>
          <p>Cifrado TLS/SSL en tránsito, controles de acceso, monitoreo, copias de seguridad y medidas organizativas.</p>
          <p class="mt-2">Si un incidente pudiera afectar tus derechos, te <strong>notificaremos</strong> oportunamente.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">7. Derechos (ARCO)</h2>
          <p>Acceso, Rectificación, Actualización y Supresión. Escribí a
            <a href="mailto:privacidad@haylugar.com.ar" class="text-primary underline font-semibold">privacidad@haylugar.com.ar</a>
            (alternativo: <a href="mailto:apphaylugar@gmail.com" class="text-primary underline font-semibold">apphaylugar@gmail.com</a>).
          </p>
          <p class="mt-2">Podés revocar tu consentimiento. Actualmente no realizamos decisiones automatizadas con efectos jurídicos ni perfilado significativo.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">8. Menores</h2>
          <p>La Plataforma es para mayores de 18 años. Cuentas detectadas de menores serán eliminadas.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">9. Comunicaciones comerciales</h2>
          <p>Solo con tu consentimiento. Podés darte de baja desde cada e-mail o por los canales de contacto.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">10. Instituciones/municipios</h2>
          <p>Las entidades pueden actuar como <strong>corresponsables</strong> o <strong>responsables independientes</strong> en su ámbito; los roles se documentan contractualmente.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">11. Modificaciones</h2>
          <p>Publicaremos cambios y solicitaremos aceptación para continuar operando.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-primary mb-2">12. AAIP</h2>
          <p>Autoridad de control: <a href="https://www.argentina.gob.ar/aaip" target="_blank" class="text-primary underline font-semibold">Agencia de Acceso a la Información Pública</a>.</p>
        </div>

        <div class="border-t pt-6">
          <h2 class="text-lg font-bold text-primary mb-2">Contacto del responsable</h2>
          <p><strong>FOUNDAR S.A.S.</strong> — CUIT: <em>30-71910647-8</em> — Domicilio: <em>Congreso 851 piso 11</em></p>
          <p>E-mail privacidad: <a href="mailto:privacidad@haylugar.com.ar" class="text-primary underline font-semibold">privacidad@haylugar.com.ar</a></p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import BackButton from '../components/common/BackButton.vue';
import MainHeader from '../components/layout/header/MainHeader.vue';

/* Solo usa RouterLink desde el router principal */
</script>

<style scoped>
a { transition: color .2s ease }
a:hover { color: #0ea5e9 }
</style>
