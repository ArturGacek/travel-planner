<template>
  <UForm :state="state" @submit="saveSettings">
    <UFormGroup
      label="Destinations View"
      class="mb-4"
      help="Choose how you would like to view destinations"
    >
      <ClientOnly>
        <USelectMenu
          v-model="state.sortView"
          :options="sorts"
          option-attribute="name"
        />
      </ClientOnly>
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup>
import { sorts } from "~/constants";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);
const state = ref({
  sortView:
    user.value.user_metadata?.sort_view ?? sorts[0].name,
});

const saveSettings = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        sort_view: state.value.sortView.name,
      },
    });
    if (error) throw error;
    toastSuccess({
      title: "Settings updated",
    });
  } catch (error) {
    toastError({
      title: "Error updating settings",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
