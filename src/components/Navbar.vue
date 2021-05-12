<template>
  <div>
    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
    >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


        <v-list-item v-if="!user" link to="/login">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user" @click="logout">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
        app
        clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{$t('Content manager')}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="user && user.email" >
        <v-chip>
          {{ user.email }}
        </v-chip>
      </v-btn>
    </v-app-bar>
  </div>
</template>



<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {auth} from "@/firebase";

@Component({
})
export default class Navbar extends Vue {
  public drawer = null

  get user() {
    return this.$store.state.user
  }

  created() {
    this.$vuetify.theme.dark = true
  }

  async logout(){
    await auth.signOut()
    this.$router.push({ name: 'Login'})
  }

}
</script>


<style scoped>
 .userChip {
   padding-right:120px
 }
</style>