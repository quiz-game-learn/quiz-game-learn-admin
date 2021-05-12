<template>
  <vue-editor v-model="content"/>
</template>

<script>
import {VueEditor} from "vue2-editor";

export default {
  name: "Editor",
  props:{
    initialContent:{
      type:String
    },
  },
  components: {VueEditor},

  data: () => ({
    content: "<h1>Some initial content</h1>"
  })
};
</script>
