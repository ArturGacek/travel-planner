<template>
  <div
    class="grid grid-cols-12 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex flex-col col-span-8 sm:col-span-5 md:col-span-7">
      <div class="flex items-center space-x-1">
        <span class="w-32 md:w-40">{{ destination.country }}</span>
        <UBadge color="white">{{
          destination.city
        }}</UBadge>
      </div>

      <div class="flex items-center space-x-1 pt-1">
        {{ destination.description }}
      </div>
    </div>

    <div class="flex flex-col sm:flex-row justify-start sm:justify-end items-center sm:space-x-4 col-span-3 md:col-span-2">
      <div class="w-full flex items-center space-x-1">
        <span>{{ destination.arrive_date }}</span>
      </div>
      <div class="w-full flex sm:hidden items-center space-x-1">
        <span>{{ destination.leaving_date }}</span>
      </div>
    </div>

    <div class="hidden sm:flex justify-end items-center space-x-4 col-span-3 md:col-span-2">
      <div class="flex items-center space-x-1">
        <span>{{ destination.leaving_date }}</span>
      </div>
    </div>

    <div class="flex items-center justify-end space-x-4 col-span-1">
      <div>
        <ClientOnly>
          <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton
              color="white"
              variant="ghost"
              trailing-icon="i-heroicons-ellipsis-horizontal"
              :loading="isLoading"
            />
            <DestinationModal v-model="isOpen" :destination="destination" @saved="emit('edited')" />
          </UDropdown>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  destination: Object,
});

const emit = defineEmits(["deleted", 'edited']);

const isLoading = ref(false);
const { toastError, toastSuccess } = useAppToast();
const supabase = useSupabaseClient();

const isOpen = ref(false)

const deleteTravelDestination = async () => {
  isLoading.value = true;
  try {
    await supabase.from("destinations").delete().eq("id", props.destination.id);
    toastSuccess({
      title: "Destination deleted",
    });
    emit("deleted", props.destination.id);
  } catch (error) {
    toastError({
      title: "Destination was not deleted",
    });
  } finally {
    isLoading.value = false;
  }
};

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => isOpen.value = true
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTravelDestination,
    },
  ],
];
</script>
