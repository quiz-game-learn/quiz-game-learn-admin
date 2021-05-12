<template>
  <v-app id="inspire">
    <Navbar/>

    <v-main>
      <router-view/>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  props: {
    source: String,
  },

  components: {
    Navbar,
  }
}
</script>