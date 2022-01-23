<template>
  <!-- データ追加／編集ダイアログ -->
  <v-dialog
    v-model="show"
    scrollable
    persistent
    max-width="500px"
    eager
  >
    <v-card>
      <v-card-title>{{ titleText }}</v-card-title>
      <v-divider/>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- 日付選択 -->
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="date"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
                hide-details
              />
            </template>
            <v-date-picker
              v-model="date"
              color="green"
              locale="ja-jp"
              :day-format="date => new Date(date).getDate()"
              no-title
              scrollable
            >
              <v-spacer/>
              <v-btn text color="grey" @click="menu = false">キャンセル</v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">選択</v-btn>
            </v-date-picker>
          </v-menu>

          <!-- カテゴリ -->
          <v-select
            label="カテゴリ"
            v-model="category"
            :items="categoryItems"
            hide-details
          />
          <!-- タグ -->
          <v-select
            label="タグ"
            v-model="tags"
            :items="tagItems"
            multiple
            chips
            :rules="[tagRule]"
          />
          <!-- メモ -->
          <v-text-field
            label="メモ"
            v-model="memo"
            :counter="300"
            :rules="[memoRule]"
          />
        </v-form>
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="grey darken-1"
          text
          :disabled="loading"
          @click="onClickClose"
        >
          キャンセル
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          :disabled="!valid"
          :loading="loading"
          @click="onClickAction"
        >
          {{ actionText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DataDialog',

  data () {
    return {
      /** ダイアログの表示状態 */
      show: false,
      /** 入力したデータが有効かどうか */
      valid: false,
      /** 日付選択メニューの表示状態 */
      menu: false,
      /** ローディング状態 */
      loading: false,

      /** 操作タイプ 'add' or 'edit' */
      actionType: 'add',
      /** id */
      id: '',
      /** 日付 */
      date: '',
      /** カテゴリ */
      category: '',
      /** タグ */
      tags: [],
      /** メモ */
      memo: '',

      /** 選択カテゴリ一覧 */
      categoryItems: [],
      /** タグリスト */
      tagItems: ['タグ1', 'タグ2'],
      /** 編集前の年月（編集時に使う） */
      beforeYM: '',

      /** バリデーションルール */
      tagRule: v => v.length <= 5 || 'タグは5種類以内で選択してください',
      
      memoRule: v => v.length <= 300 || 'メモは300文字以内で入力してください'
    }
  },

  computed: {
    /** ダイアログのタイトル */
    titleText () {
      return this.actionType === 'add' ? 'データ追加' : 'データ編集'
    },
    /** ダイアログのアクション */
    actionText () {
      return this.actionType === 'add' ? '追加' : '更新'
    }
  },

  methods: {
    /**
     * ダイアログを表示します。
     * このメソッドは親から呼び出されます。
     */
    open (actionType, item) {
      this.show = true
      this.actionType = actionType
      this.resetForm(item)

      if (actionType === 'edit') {
        this.beforeYM = item.date.slice(0, 7)
      }
    },
    /** キャンセルがクリックされたとき */
    onClickClose () {
      this.show = false
    },
    /** 追加／更新がクリックされたとき */
    onClickAction () {
      // あとで実装
    },
    /** フォームの内容を初期化します */
    resetForm (item = {}) {
      const today = new Date()
      const year = today.getFullYear()
      const month = ('0' + (today.getMonth() + 1)).slice(-2)
      const date = ('0' + today.getDate()).slice(-2)

      this.id = item.id || ''
      this.date = item.date || `${year}-${month}-${date}`

      this.category = item.category || this.categoryItems[0]
      this.tags = item.tags ? item.tags.split(',') : []
      this.memo = item.memo || ''

      this.$refs.form.resetValidation()
    }
  }
}
</script>