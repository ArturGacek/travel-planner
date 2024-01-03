export const useFetchTravelDestinations = (sort) => {
    const supabase = useSupabaseClient();
    
    const travelDestinations = ref([]);
    const pending = ref(false);
  
    const itemsCount = computed(() => travelDestinations.value?.length || 0);

    const fetchTravelDestinations = async () => {
      pending.value = true;
      try {
        const sortByColumn = sort.value?.split(':')[0] ?? "arrive_date";
        const ascending = sort.value?.split(':')[1] ? sort.value?.split(':')[1] === 'asc' : true
        const { data } = await useAsyncData(
          `destinations`,
          async () => {
            const { data, error } = await supabase
              .from("destinations")
              .select()
              .order(sortByColumn, { ascending });
            if (error) return [];
  
            return data;
          }
        );
  
        return data.value;
      } finally {
        pending.value = false;
      }
    };
  
    const refresh = async () => (travelDestinations.value = await fetchTravelDestinations());
    watch(sort, async () => {
      await refresh()
    }, { immediate: true } );
    
    return {
      travelDestinations,
      itemsCount,
      refresh,
      pending,
    };
  };
  