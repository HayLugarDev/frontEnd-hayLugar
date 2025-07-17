import { ref, computed, watch } from 'vue';

export interface Space {
  id: number;
  name: string;
  location: string;
  [key: string]: any;
}

export function useSpaceSearch(spaces: Space[]) {
  const searchTerm = ref('');
  const filteredSpaces = computed(() =>
    spaces.filter(space =>
      space.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      space.location.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  );

  return {
    searchTerm,
    filteredSpaces
  };
}
