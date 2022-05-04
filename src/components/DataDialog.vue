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
          <v-text-field
            label="カテゴリ"
            v-model="category"
            :items="categoryItems"
            :counter="100"
            :rules="[partsRule]"
          />
          <!-- 取付部品 -->
          <v-text-field
            label="取付部品"
            v-model="mounts"
            :items="mountItems"
            :counter="100"
            :rules="[partsRule]"
          />
          <!-- 取付部品詳細 -->
          <v-text-field
            label="取付部品詳細"
            v-model="mountparts"
            :counter="100"
            :rules="[partsRule]"
          />
          <!-- 取付部品No -->
          <v-text-field
            label="取付部品No"
            v-model="mountNo"
            :counter="100"
            :rules="[partsRule]"
          />
          <!-- 取外部品 -->
          <v-text-field
            label="取外し部品"
            v-model="removes"
            :items="removeItems"
            :counter="100"
            :rules="[partsRule]"
          />
          <!-- 取外し部品詳細 -->
          <v-text-field
            label="取外し部品詳細"
            v-model="removeparts"
            :counter="100"
            :rules="[partsRule]"
          />
          <!-- 取外し部品No -->
          <v-text-field
            label="取外し部品No"
            v-model="removeNo"
            :counter="100"
            :rules="[partsRule]"
          />
          <!-- メモ -->
          <v-textarea
            label="メモ"
            v-model="memo"
            :counter="1000"
            :rules="[memoRule]"
          />
          <!-- 写真  -->
          <v-text-field
            label="写真ID"
            v-model="photo"
            :counter="100"
            :rules="[partsRule]"
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
    /** 親から受け取るシート名,ID */
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
      /** 取付部品詳細 */
      mountparts: '',
      /** 取付部品No */
      mountNo: '',
      /** 取外し部品 */
      removes: '',
      /** 取外し部品詳細 */
      removeparts: '',
      /** 取外し部品No */
      removeNo: '',
      /** メモ */
      memo: '',
      /** 写真ID */
      photo: '',
      
      /** 編集前の年月（編集時に使う） */
      beforeYM: '',

      /** バリデーションルール */
      partsRule: v => v.length <= 100 || '100文字以内で入力してください',
      memoRule: v => v.length <= 1000 || 'メモは1000文字以内で入力してください',

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
        mountparts: this.mountparts,
        mountNo: this.mountNo,
        removes: this.removes,
        removeparts: this.removeparts,
        removeNo: this.removeNo,
        memo: this.memo,
        photo: this.photo
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

      this.category = item.category || ''
      this.mounts = item.mounts || ''
      this.mountparts = item.mountparts || ''
      this.mountNo = item.mountNo || ''
      this.removes = item.removes || ''
      this.removeparts = item.removeparts || ''
      this.removeNo = item.removeNo || ''
      this.memo = item.memo || ''
      this.photo = item.photo || ''

      this.$refs.form.resetValidation()
    }
  }
}
</script>