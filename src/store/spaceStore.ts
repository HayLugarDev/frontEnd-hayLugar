
import { defineStore } from 'pinia';
import { showToast } from '../utils/toast';
import {
  getAllSpaces,
  getFilteredSpaces,
  getUniversitySpaces,
  getSpaceById,
  getSpaceBySlug,
  getSpaceImages,
} from '../services/spaceService';
import { calculateDistance } from '../utils/distance';
import { getUserFavorites } from '../services/favoriteService';

export const useSpaceStore = defineStore('space', {
  state: () => ({
    spaces: [] as any[],
    selectedSpace: null as any | null,
    favorites: [] as any[],
    userLocation: null as { lat: number, lng: number } | null,
    loading: false,
    error: null as string | null,
    loadedOnce: false,
  }),

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

    // 🔹 Nueva acción: obtener la ubicación del usuario
    async setUserLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject('Geolocalización no soportada');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.userLocation = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            resolve(this.userLocation);
          },
          (err) => reject(err)
        );
      });
    },

    /**
     * 🔹 Trae todos los espacios (mantiene lo existente, pero ahora ordena si hay ubicación)
     */
    async fetchSpaces(force = false) {
      if (this.loadedOnce && !force) return this.spaces;
      this.loading = true;
      this.error = null;

      try {
        const spaces = await getAllSpaces();

        // Si tenemos ubicación, ordenamos por distancia
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

    /**
     * 🔹 Busca espacios con filtros (extiende tu método actual)
     */
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

    /**
     * 🔹 Trae solo espacios de universidades.
     */
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

    /**
     * 🔹 Obtiene un espacio por ID (usa cache si ya lo tiene).
     */
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

    /**
 * 🔹 Obtiene un espacio por slug (y carga todas las imágenes).
 */
    async fetchSpaceBySlug(slug: string, force = false) {
      if (!force && this.selectedSpace?.slug === slug) return this.selectedSpace;

      this.loading = true;
      this.error = null;

      try {
        // 1️⃣ Trae los datos base del espacio
        const space = await getSpaceBySlug(slug);

        if (space) {
          // 2️⃣ Si no tiene las imágenes completas, las busca
          if (!space.images || space.images.length <= 1) {
            try {
              if (!space.images || space.images.length < 3) {
                const images = await getSpaceImages(space.id);
                if (images.length > 0) {
                  space.images = images;
                }
              }
            } catch (imgError) {
              console.warn(`⚠️ No se pudieron cargar imágenes para ${slug}:`, imgError);
            }
          }

          // 3️⃣ Actualiza el espacio seleccionado
          this.selectedSpace = space;

          // 4️⃣ Si ya existe en la lista, lo actualiza; si no, lo agrega
          const idx = this.spaces.findIndex((s) => s.id === space.id);
          if (idx >= 0) this.spaces[idx] = space;
          else this.spaces.push(space);
        }

        return space;
      } catch (error: any) {
        console.error("Error al obtener el espacio por slug:", error);
        this.error = "Error al obtener el espacio";
      } finally {
        this.loading = false;
      }
    },

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
      if (this.favorites.length === 0) {
        await this.fetchFavoriteSpaces();
      }
      return this.favorites.some((fav: any) => fav.id === spaceId);
    },

    /**
     * 🔹 Agrega un nuevo espacio al store (se asume que fue creado en backend).
     */
    addSpaceToStore(space: any) {
      this.spaces.unshift(space);
      showToast?.('Espacio agregado correctamente', 'success');
    },

    /**
     * 🔹 Actualiza un espacio ya existente en el store local.
     */
    updateSpaceInStore(updatedSpace: any, payload?: any) {

      const idx = this.spaces.findIndex((s: any) => s.id === updatedSpace.id);
      if (idx >= 0) {
        this.spaces[idx] = { ...this.spaces[idx], ...updatedSpace };
        if (this.selectedSpace?.id === updatedSpace.id) {
          this.selectedSpace = { ...this.selectedSpace, ...updatedSpace };
        }
        showToast?.('Espacio actualizado', 'success');
      }
    },

    /**
     * 🔹 Elimina un espacio localmente del store (después de borrar en backend).
     */
    removeSpaceFromStore(id: number) {
      this.spaces = this.spaces.filter((s: any) => s.id !== id);
      if (this.selectedSpace?.id === id) this.selectedSpace = null;
      showToast?.('Espacio eliminado', 'success');
    },

    /**
     * 🔹 Limpia todos los datos del store (por ejemplo, al cerrar sesión).
     */
    clearSpaces() {
      this.spaces = [];
      this.selectedSpace = null;
      this.loadedOnce = false;
    },
  },
});
