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
          <!-- 取付部品 -->
          <v-select
            label="取付部品"
            v-model="mounts"
            :items="mountItems"
          />
          <!-- 取外部品 -->
          <v-select
            label="取外し部品"
            v-model="removes"
            :items="removeItems"
          />
          <!-- メモ -->
          <v-textarea
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
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'DataDialog',

  props: [
    "ids",
    "names"
  ],

  data () {
    return {

      /** ダイアログの表示状態 */
      show: false,
      /** 入力したデータが有効かどうか */
      valid: false,
      /** 日付選択メニューの表示状態 */
      menu: false,


      /** 操作タイプ 'add' or 'edit' */
      actionType: 'add',
      /** id */
      id: '',
      /** 日付 */
      date: '',
      /** カテゴリ */
      category: '',
      /** 取付部品 */
      mounts: '',
      /** 取外し部品 */
      removes: '',
      /** メモ */
      memo: '',

      /** 選択カテゴリ一覧 */
      //categoryItems: [],
      /** 部品一覧 */
      //mountItems: [],
      /** 部品一覧 */
      //removeItems: [],
      
      /** 編集前の年月（編集時に使う） */
      beforeYM: '',

      /** バリデーションルール */
      tagRule: v => v.length <= 5 || 'タグは5種類以内で選択してください',
      
      memoRule: v => v.length <= 300 || 'メモは300文字以内で入力してください'
    }
  },

  computed: {
    ...mapGetters([
      /** 各種カテゴリ */
      'categoryItems',
      'mountItems',
      'removeItems'
    ]),

    ...mapState({
      /** ローディング状態 */
      loading: state => state.loading.add || state.loading.update
    }),

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
    ...mapActions([
      'addAbData',
      'updateAbData'
    ]),

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
    async onClickAction () {
      const item = {
        date: this.date,
        category: this.category,
        mounts: this.mounts,
        removes: this.removes,
        memo: this.memo,
      }

      const sheetId = this.ids.sheetId
      const sheetName = this.names.sheetName

      if (this.actionType === 'add') {
        await this.addAbData({ item, sheetId, sheetName })
      } else {
        item.id = this.id
        await this.updateAbData({ item, sheetId, sheetName })
      }

      this.show = false
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
      this.mounts = item.mounts || this.mountItems[0]
      this.removes = item.removes || this.removeItems[0]
      this.memo = item.memo || ''

      this.$refs.form.resetValidation()
    }
  }
}
</script>