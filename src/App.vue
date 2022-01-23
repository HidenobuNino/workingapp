<template>
  <v-app>
    <v-app-bar app color="blue" dark>
      <v-toolbar-title>{{ appName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/">
        <v-icon>mdi-file-table-outline</v-icon>
      </v-btn>
      <v-btn icon to="/settings">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',

  computed: mapState({
    appName: state => state.settings.appName
  }),

  beforeCreate () {
    this.$store.dispatch('loadSettings')
  }
}
</script>
