<template>
  <v-app>
    <v-app-bar app color="blue" dark>
      <v-toolbar-title>{{ appName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/">
        <v-icon>mdi-file-table-outline</v-icon>
      </v-btn>
      <v-btn icon @click="onClickTemplate">
        <v-icon>mdi-clipboard-arrow-up-outline</v-icon>
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
    <v-snackbar v-model="snackbar" color="error">{{ errorMessage }}</v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',

  data () {
    return {
      snackbar: false
    }
  },

  computed: mapState({
    appName: state => state.settings.appName,
    templateUrl: state => state.settings.templateUrl,
    errorMessage: state => state.errorMessage
  }),

  methods: {
    onClickTemplate () {
      const url = this.templateUrl
      window.open(url, '_blank', 'noreferrer')
    }
  },

  watch: {
    errorMessage () {
      this.snackbar = true
    }
  },

  //appインスタンス生成前に一度だけ実行される関数
  beforeCreate () {
    this.$store.dispatch('loadSettings')
  }
}
</script>
