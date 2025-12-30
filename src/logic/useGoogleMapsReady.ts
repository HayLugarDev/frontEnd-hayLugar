import { ref, onMounted } from 'vue'

export function useGoogleMapsReady() {
  const isReady = ref(false)

  function check() {
    if ((window as any).google?.maps) {
      isReady.value = true
    }
  }

  onMounted(() => {
    check()

    if (!isReady.value) {
      const interval = setInterval(() => {
        check()
        if (isReady.value) clearInterval(interval)
      }, 50)
    }
  })

  return { isReady }
}
