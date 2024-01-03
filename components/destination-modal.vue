<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        {{ isEditing ? "Edit" : "Add" }} Destination
      </template>

      <UForm :state="state" :schema="schema" ref="form" @submit="save">
      
        <UFormGroup
          label="country"
          :required="true"
          name="country"
          hint="Only letters"
          class="mb-4"
        >
          <UInput placeholder="Country" v-model="state.country" />
        </UFormGroup>

        <UFormGroup
          label="city"
          :required="true"
          name="city"
          hint="Only letters"
          class="mb-4"
        >
          <UInput placeholder="City" v-model="state.city" />
        </UFormGroup>

        <UFormGroup
          label="description"
          hint="Optional (max 60 characters)"
          name="description"
          class="mb-4"
        >
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UFormGroup
          label="arrive_date"
          :required="true"
          name="arrive_date"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.arrive_date"
            placeholder="Arriving date"
          />
        </UFormGroup>

        <UFormGroup
          label="leaving_date"
          :required="true"
          name="leaving_date"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.leaving_date"
            placeholder="Date of leaving"
            :disabled="!state.arrive_date"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="black"
          variant="solid"
          label="Save"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { z } from "zod";

const props = defineProps({
  modelValue: Boolean,
  destination: {
    type: Object,
    required: false,
  },
});
const isEditing = computed(() => !!props.destination);
const emit = defineEmits(["update:modelValue", "saved"]);

const schema = z.object({
  city: z.string().regex( new RegExp(/^[A-Za-z\-]+$/)),
  country: z.string().regex( new RegExp(/^[A-Za-z\-]+$/)),
  description: z.string().max(60).optional(),
  arrive_date: z.string(),
  leaving_date: z.string(),
});


const form = ref();
const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();

const save = async () => {
  if (form.value.errors.length) return;

  isLoading.value = true;
  try {
    const { error } = await supabase.from("destinations").upsert({
      ...state.value,
      id: props.destination?.id,
    });
    if (!error) {
      toastSuccess({
        title: "Destination saved",
      });
      isOpen.value = false;
      emit("saved");
      return;
    }
    throw error;
  } catch (e) {
    toastError({
      title: "Destination not saved",
      description: e.message,
    });
  } finally {
    isLoading.value = false;
  }
};

const initialState = isEditing.value
  ? {
      city: props.destination.city,
      country: props.destination.country,
      description: props.destination.description,
      arrive_date: props.destination.arrive_date?.split("T")[0],
      leaving_date: props.destination.leaving_date?.split("T")[0],
    }
  : {
      city: undefined,
      country: undefined,
      description: undefined,
      arrive_date: undefined,
      leaving_date: undefined,
    };

const state = ref({ ...initialState });

const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value.clear();
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});
</script>
