<template>
  <div>
    <v-card>
      <v-card-title>
        <!-- 月選択 -->
        <v-col cols="8">
          <v-select
            v-model="e1"
            :items="companies"
            menu-props="{ offsetY: true }"
            label="閲覧するデータを選択します"
            hide-details
            prepend-icon="mdi-map"
          ></v-select>
        </v-col>
        <v-spacer/>
        <!-- 追加ボタン -->
        <v-col class="text-right" cols="4">
          <v-btn dark color="green" @click="onClickAdd">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <!-- 検索フォーム -->
        <v-col cols="12">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </v-col>
      </v-card-title>
      <!-- テーブル -->
      <v-data-table
        class="text-no-wrap"
        :headers="tableHeaders"
        :items="tableData"
        :search="search"
        :footer-props="footerProps"
        :loading="loading"
        :sort-by="'date'"
        :sort-desc="true"
        :items-per-page="30"
        mobile-breakpoint="0"
      >
      <!-- 追加／編集ボタン -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="onClickEdit(item)">mdi-pencil</v-icon>
        <v-icon @click="onClickDelete(item)">mdi-delete</v-icon>
      </template>
      </v-data-table>
    </v-card>
    <!-- 追加／編集ダイアログ -->
    <data-dialog ref="dataDialog"/>
    <!-- 削除ダイアログ -->
    <delete-dialog ref="deleteDialog"/>
  </div>
</template>

<style>
  .v-data-footer {
    justify-content: right;
  }
</style>

<script>
import DataDialog from '../components/DataDialog.vue'
import DeleteDialog from '../components/DeleteDialog.vue'

  export default {
  components: { DataDialog, DeleteDialog },
  name: 'Home',

  data () {

    return {
      /** ローディング状態 */
      loading: false,
      /** 月選択メニューの状態 */
      menu: false,
      /** 検索文字 */
      search: '',

      e1: 'company1',
      companies: [
        'company1', 'company2', 'company3',
      ],
      /** テーブルに表示させるデータ */
      tableData: [
        /** サンプルデータ */
        { id: 'a34109ed', date: '2020-06-01', category: 'トラブル', mount: 'a', remove: 'b',  memo: 'メモメモメモメモメモメモ' },
        { id: '7c8fa764', date: '2020-06-02', category: '問い合わせ', mount: 't', remove: 'y',  memo: 'メモ' }
      ]
    }
  },

  computed: {
    /** テーブルのヘッダー設定 */
    tableHeaders () {
      return [
        { text: 'カテゴリ', value: 'category', sortable: false },
        { text: '日付', value: 'date', align: 'end' },
        { text: '取付部品', value: 'mount', sortable: false },
        { text: '取外部品', value: 'remove', sortable: false },
        { text: 'メモ', value: 'memo', sortable: false },
        { text: '写真', value: 'photo', sortable: false },
        { text: '操作', value: 'actions', sortable: false }
      ]
    },

    /** テーブルのフッター設定 */
    footerProps () {
      return { itemsPerPageText: '', itemsPerPageOptions: [] }
    }
  },

  methods: {
    onClickAdd () {
      this.$refs.dataDialog.open('add')
    },

    onClickEdit (item) {
      this.$refs.dataDialog.open('edit', item)
    },

    onClickDelete (item) {
      this.$refs.deleteDialog.open(item)
    }
  }
}
</script>
