// src/store/industrialStore.ts
import { defineStore } from 'pinia';
import api from '../services/apiService';

export interface IndustrialSpace {
  id: number;
  park_id: number;
  name: string;
  slug: string;
  subcategory: string | null;
  capacity_m2: number | null;
  height_m: number | null;
  has_security: boolean;
  has_loading_dock: boolean;
  has_cold_chain: boolean;
  energy_3phase: boolean;
  price_per_unit: number | null;
  pricing_unit: string | null;
  suitable_for?: string | null;
  images?: string[] | string | null;
  // opcional: si más adelante unís con parque
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface FiltersPayload {
  search?: string;
  subcategory?: string;
}

export const useIndustrialStore = defineStore('industrial', {
  state: () => ({
    spaces: [] as IndustrialSpace[],
    selectedSpace: null as IndustrialSpace | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadSpacesByFilters(filters: FiltersPayload) {
      try {
        this.loading = true;
        this.error = null;

        // Por ahora cargamos de un parque fijo (ej: ID=1)
        const res = await api.get('/industrial/parks/1/spaces');
        let list: IndustrialSpace[] = res.data?.data || [];

        // Normalizar imágenes si vienen como JSON string
        list = list.map((space) => {
          let imgs: any = space.images;
          if (typeof imgs === 'string') {
            try {
              imgs = JSON.parse(imgs);
            } catch {
              imgs = [];
            }
          }
          return {
            ...space,
            images: Array.isArray(imgs) ? imgs : [],
          };
        });

        // Filtros básicos en front
        if (filters.subcategory) {
          list = list.filter((s) => s.subcategory === filters.subcategory);
        }

        if (filters.search) {
          const q = filters.search.toLowerCase();
          list = list.filter((s) =>
            s.name.toLowerCase().includes(q)
          );
        }

        this.spaces = list;
      } catch (err: any) {
        console.error('Error al cargar espacios industriales:', err);
        this.error = 'Error al cargar espacios industriales';
      } finally {
        this.loading = false;
      }
    },

    async fetchSpaceBySlug(slug: string) {
      try {
        this.loading = true;
        this.error = null;

        const res = await api.get(`/industrial/spaces/slug/${slug}`);
        const data: any = res.data?.data;

        if (!data) {
          this.selectedSpace = null;
          return;
        }

        let imgs: any = data.images;
        if (typeof imgs === 'string') {
          try {
            imgs = JSON.parse(imgs);
          } catch {
            imgs = [];
          }
        }

        this.selectedSpace = {
          ...data,
          images: Array.isArray(imgs) ? imgs : [],
        };
      } catch (err: any) {
        console.error('Error al cargar espacio industrial por slug:', err);
        this.error = 'Error al cargar el espacio industrial';
        this.selectedSpace = null;
      } finally {
        this.loading = false;
      }
    },
  },
});
