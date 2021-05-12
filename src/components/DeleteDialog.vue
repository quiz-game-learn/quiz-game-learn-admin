<template>
  <v-row justify="center">
    <v-dialog
        v-model="show"
        max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('Deletion confirmation') }}
        </v-card-title>
        <v-card-text> {{ $t('Are you sure you want to delete?') }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="emitDelete"
          >
            {{ $t('Yes') }}
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="show = false"
          >
            {{ $t('No') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name:"DeleteDialog",
  props: {
    value: Boolean
  },
  methods:{
    emitDelete(){
      this.show=false
      this.$emit("deleteAction",true)
    }
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>