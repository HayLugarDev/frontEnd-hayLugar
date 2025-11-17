import { defineStore } from 'pinia';
import { showToast } from '../utils/toast';
import {
  getAllSpaces,
  getFilteredSpaces,
  getUniversitySpaces,
  getSpaceById,
  getSpaceBySlug,
  getSpaceImages,
  getIndustrialSpaces, // 🔹 Nuevo servicio
} from '../services/spaceService';
import { calculateDistance } from '../utils/distance';
import { getUserFavorites } from '../services/favoriteService';

export const useSpaceStore = defineStore('space', {
  state: () => ({
    spaces: [] as any[],
    selectedSpace: null as any | null,
    favorites: [] as any[],
    userLocation: null as { lat: number; lng: number } | null,
    loading: false,
    error: null as string | null,
    loadedOnce: false,
    reservationDraft: {
    slug: null as string | null,
    spaceId: null as number | null,
    startDate: '',
    endDate: '',
    pricingUnit: 'day' as 'hour' | 'day' | 'week' | 'month',
    pricePerUnit: 0,
    method: 'wallet' as 'wallet' | 'mercadopago' | 'manual_contract',
    notes: '',
    costEstimation: 0,
  },
  }

),

  getters: {
    allSpaces: (state) => state.spaces,
    hasSpaces: (state) => state.spaces.length > 0,
    getSpaceBySlug: (state) => (slug: string) => state.spaces.find((s) => s.slug === slug),
  },

  actions: {
    setSpaces(spaces: any[]) {
      this.spaces = spaces;
    },
    addSpace(space: any) {
      this.spaces.push(space);
    },

    // 🔹 Ubicación del usuario (se mantiene)
    async setUserLocation() {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          console.warn('Geolocalización no soportada');
          this.userLocation = null;
          resolve(null);
          return;
        }

        const options = { timeout: 5000, maximumAge: 10000 };

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.userLocation = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            resolve(this.userLocation);
          },
          (err) => {
            console.warn('Error en geolocalización:', err);
            this.userLocation = null;
            resolve(null);
          },
          options
        );
      });
    },

    // 🔹 Espacios generales
    async fetchSpaces(force = false) {
      if (this.loadedOnce && !force) return this.spaces;
      this.loading = true;
      this.error = null;

      try {
        const spaces = await getAllSpaces();

        if (this.userLocation) {
          this.spaces = spaces
            .map((s: any) => ({
              ...s,
              distancia: calculateDistance(
                this.userLocation!.lat,
                this.userLocation!.lng,
                Number(s.latitude),
                Number(s.longitude)
              ),
            }))
            .sort((a, b) => a.distancia - b.distancia);
        } else {
          this.spaces = spaces;
        }

        this.loadedOnce = true;
        return this.spaces;
      } catch (error: any) {
        console.error('Error al cargar espacios:', error);
        this.error = 'Error al obtener los espacios';
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Filtros generales
    async fetchFilteredSpaces(filters: {
      searchQuery?: string;
      checkIn?: string;
      checkOut?: string;
      publishedDate?: string;
      maxPrice?: string;
      sortBy?: string;
    }) {
      this.loading = true;
      this.error = null;
      try {
        const filtered = await getFilteredSpaces(filters);
        this.spaces = filtered;

        if (this.userLocation && filters.sortBy === 'nearest') {
          this.spaces = filtered
            .map((s: any) => ({
              ...s,
              distancia: calculateDistance(
                this.userLocation!.lat,
                this.userLocation!.lng,
                Number(s.latitude),
                Number(s.longitude)
              ),
            }))
            .sort((a, b) => a.distancia - b.distancia);
        }

        if (!filtered.length) this.error = 'No se encontraron espacios con esos filtros.';
        return filtered;
      } catch (error: any) {
        console.error('Error al obtener espacios filtrados:', error);
        this.error = 'Error al filtrar los espacios';
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Espacios universitarios
    async fetchUniversitySpaces() {
      this.loading = true;
      try {
        const universitySpaces = await getUniversitySpaces();
        this.spaces = universitySpaces;
        return universitySpaces;
      } catch (error: any) {
        console.error('Error al cargar espacios universitarios:', error);
        this.error = 'Error al cargar espacios universitarios';
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 🔹 🏭 NUEVO: Espacios industriales y logísticos
    async fetchIndustrialSpaces(params?: { searchQuery?: string; subcategory?: string }) {
      this.loading = true;
      this.error = null;

      try {
        const industrialSpaces = await getIndustrialSpaces(params);

        if (this.userLocation) {
          this.spaces = industrialSpaces
            .map((s: any) => ({
              ...s,
              distancia: calculateDistance(
                this.userLocation!.lat,
                this.userLocation!.lng,
                Number(s.latitude),
                Number(s.longitude)
              ),
            }))
            .sort((a, b) => a.distancia - b.distancia);
        } else {
          this.spaces = industrialSpaces;
        }

        if (!industrialSpaces.length) this.error = 'No se encontraron espacios industriales.';

        return industrialSpaces;
      } catch (error: any) {
        console.error('Error al cargar espacios industriales:', error);
        this.error = 'Error al cargar espacios industriales';
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Por ID
    async fetchSpaceById(id: number, force = false) {
      if (!force) {
        const local = this.spaces.find((s: any) => s.id === id);
        if (local) {
          this.selectedSpace = local;
          return local;
        }
      }

      this.loading = true;
      this.error = null;

      try {
        const space = await getSpaceById(id);
        if (space) {
          this.selectedSpace = space;
          const idx = this.spaces.findIndex((s: any) => s.id === id);
          if (idx >= 0) this.spaces[idx] = space;
          else this.spaces.push(space);
        }
        return space;
      } catch (error: any) {
        console.error('Error al obtener el espacio por ID:', error);
        this.error = 'Error al obtener el espacio';
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Por slug
    async fetchSpaceBySlug(slug: string, force = false) {
      if (!force && this.selectedSpace?.slug === slug) return this.selectedSpace;

      this.loading = true;
      this.error = null;

      try {
        const space = await getSpaceBySlug(slug);

        if (space) {
          if (!space.images || space.images.length <= 1) {
            try {
              const images = await getSpaceImages(space.id);
              if (images.length > 0) space.images = images;
            } catch (imgError) {
              console.warn(`⚠️ No se pudieron cargar imágenes para ${slug}:`, imgError);
            }
          }

          this.selectedSpace = space;

          const idx = this.spaces.findIndex((s) => s.id === space.id);
          if (idx >= 0) this.spaces[idx] = space;
          else this.spaces.push(space);
        }

        return space;
      } catch (error: any) {
        console.error('Error al obtener el espacio por slug:', error);
        this.error = 'Error al obtener el espacio';
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Favoritos
    async fetchFavoriteSpaces() {
      this.loading = true;
      this.error = null;
      try {
        const favoriteSpaces = await getUserFavorites();
        this.favorites = favoriteSpaces;
        return favoriteSpaces;
      } catch (error: any) {
        console.error('Error al cargar espacios favoritos:', error);
        this.error = 'Error al cargar espacios favoritos';
        return [];
      } finally {
        this.loading = false;
      }
    },

    async isFavorite(spaceId: number) {
      if (this.favorites.length === 0) await this.fetchFavoriteSpaces();
      return this.favorites.some((fav: any) => fav.id === spaceId);
    },

    /**
     * 🔹 Agrega un nuevo espacio al store (se asume que fue creado en backend).
     */
    async addSpaceToStore(space: any) {
      this.spaces.unshift(space);
      showToast?.('Espacio agregado correctamente', 'success');
      console.log(this.spaces);
    },

    updateSpaceInStore(updatedSpace: any) {
      const idx = this.spaces.findIndex((s: any) => s.id === updatedSpace.id);
      if (idx >= 0) {
        this.spaces[idx] = { ...this.spaces[idx], ...updatedSpace };
        if (this.selectedSpace?.id === updatedSpace.id) {
          this.selectedSpace = { ...this.selectedSpace, ...updatedSpace };
        }
        showToast?.('Espacio actualizado', 'success');
      }
    },

    removeSpaceFromStore(id: number) {
      this.spaces = this.spaces.filter((s: any) => s.id !== id);
      if (this.selectedSpace?.id === id) this.selectedSpace = null;
      showToast?.('Espacio eliminado', 'success');
    },

    /**
     * 🔹 Obtiene un espacio directamente desde el store sin llamar al backend.
     *    Si no existe, devuelve null.
     */
    getSpaceFromStore(identifier: number | string) {
      // Si el identificador es un número => busca por ID
      if (typeof identifier === 'number') {
        const found = this.spaces.find((s: any) => s.id === identifier) || null;
        this.selectedSpace = found;
        return found;
      }

      // Si es un string => busca por slug
      const found = this.spaces.find((s: any) => s.slug === identifier) || null;
      this.selectedSpace = found;
      return found;
    },
    
    /**
     * 🔹 Limpia todos los datos del store (por ejemplo, al cerrar sesión).
     */
    clearSpaces() {
      this.spaces = [];
      this.selectedSpace = null;
      this.loadedOnce = false;
    },
    // ===============================
// 🔹 INDUSTRIAL LOGISTICS HELPERS
// ===============================

setReservationDraft(partial: Partial<typeof this.reservationDraft>) {
  this.reservationDraft = { ...this.reservationDraft, ...partial };
},

clearReservationDraft() {
  this.reservationDraft = {
    slug: null,
    spaceId: null,
    startDate: '',
    endDate: '',
    pricingUnit: 'day',
    pricePerUnit: 0,
    method: 'wallet',
    notes: '',
    costEstimation: 0,
  };
},

simulateAvailability(space: any, startISO: string, endISO: string) {
  try {
    if (!space?.availability) return true;
    // Simulación simple: si el espacio está activo y dentro del horario → disponible
    const now = new Date();
    const start = new Date(startISO);
    const end = new Date(endISO);
    return (
      space.status === 'active' &&
      start >= now &&
      end > start
    );
  } catch {
    return true;
  }
},

estimateCost(
  pricingUnit: 'hour' | 'day' | 'week' | 'month',
  pricePerUnit: number,
  startISO: string,
  endISO: string
) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0;

  const ms = end.getTime() - start.getTime();
  const hours = ms / 36e5;
  const days = Math.ceil(hours / 24);
  const weeks = Math.ceil(days / 7);
  const months = Math.ceil(days / 30);

  const units =
    pricingUnit === 'hour'
      ? Math.ceil(hours)
      : pricingUnit === 'day'
      ? Math.max(1, days)
      : pricingUnit === 'week'
      ? Math.max(1, weeks)
      : Math.max(1, months);

  return Math.round(units * (pricePerUnit || 0));
},
  },
});
