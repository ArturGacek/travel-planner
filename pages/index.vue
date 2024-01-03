<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Plan Your next travel</h1>
    <div>
      <ClientOnly>
        <USelectMenu
          :options="sorts"
          v-model="selectedView"
          value-attribute="name"
          option-attribute="name"
        />
      </ClientOnly>
    </div>
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Destinactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ itemsCount }} planned destinations this year
      </div>
    </div>
    <div>
      <DestinationModal v-model="isOpen" @saved="refresh()" />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
  </section>

  <section v-if="!pending">
    <Destination
      v-for="destination in travelDestinations"
      :key="destination.id"
      :destination="destination"
      @deleted="refresh()"
      @edited="refresh()"
    />
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { sorts } from "~/constants";

const user = useSupabaseUser();
const selectedView = ref(user.value.user_metadata?.sort_view ?? sorts[0].name);

const selectedViewId = computed(
  () => sorts.find((sort) => sort.name === selectedView.value).id
);
const isOpen = ref(false);

const { pending, refresh, itemsCount, travelDestinations } =
  useFetchTravelDestinations(selectedViewId);

const loadOnce = ref(false);

if (!loadOnce.value) {
  await refresh();
  loadOnce.value = true;
}
</script>
