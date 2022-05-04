<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="500px"
  >
    <v-card>
      <v-card-title>新規シート追加</v-card-title>
      <v-divider/>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            label="作成するシート名を入力"
            v-model="newSheetName"
            :counter="20"
            :rules="[stringRule]"
          />
        </v-form>
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="grey darken-1"
          :disabled="loading"
          @click="onClickClose"
        >
        キャンセル
        </v-btn>
        <v-btn
          color="blue darken-1"
          :loading="loading"
          @click="onClickAction"
        >
        追加
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'AddSheetDialog',

  props: [
    "ids"
  ],

  data () {
    return {
      show: false,
      valid: false,

      newSheetName: '',

      stringRule: v => v.length <= 20 || '20文字以内で入力してください',
    }
  },

  computed: {
    ...mapState({
      loading: state => state.loading.insert
    })
  },

  methods: {
    ...mapActions([
      'addSheet'
    ]),

    open () {
      this.show = true
    },

    onClickClose () {
      this.show = false
    },

    async onClickAction () {
      const sheetId = this.ids.sheetId

      await this.addSheet({ sheetId, givenSheetName: this.newSheetName })
      this.show = false
    },
  }
}
</script>
