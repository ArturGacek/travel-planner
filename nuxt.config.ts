// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "@nuxtjs/color-mode"],
  colorMode: {
    classSuffix: "",
  },
  supabase: {
    redirect: true,
  },
});
