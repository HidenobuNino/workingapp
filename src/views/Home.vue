<template>
  <div>
    <v-card>
      <v-card-title>
        <!-- ファイル選択 -->
        <v-col cols="8">
          <v-select
            v-model="e1"
            item-text="name"
            item-value="sheetId"
            :items="companies"
            menu-props="{ offsetY: true }"
            label="閲覧するデータを選択します"
            hide-details
            prepend-icon="mdi-map"
          ></v-select>
          <v-card-actions class="ma-4">
            <v-radio-group v-model="sheetname">
              <v-radio
                v-for="n in 3"
                :key="n"
                :value="n"
              >
              </v-radio>
            </v-radio-group>
          </v-card-actions>
        </v-col>
        <v-spacer/>
        <!-- 追加ボタン -->
        <v-col class="text-right" cols="4">
          <v-btn dark color="blue" @click="onClickAdd">
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
      <!-- タブ -->
      
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
      <template v-slot:[`item.memo`]="{ item }">
        <div style="white-space: pre;">{{ item.memo }}</div>
      </template>
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
import { mapState, mapActions } from 'vuex'
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
      test: 'test',
      e1: '',
      companies: [],
      /** テーブルに表示させるデータ */
      tableData: []
    }
  },

  computed: {
    ...mapState({
      /** データを取得 */
      companyData: state => state.companyData,
      abData: state => state.abData
    }),


    /** テーブルのヘッダー設定 */
    tableHeaders () {
      return [
        { text: '日付', value: 'date', align: 'end' },
        { text: 'カテゴリ', value: 'category', sortable: false },
        { text: '取付部品', value: 'mounts', sortable: false },
        { text: '取外部品', value: 'removes', sortable: false },
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
    ...mapActions([
      'fetchCompanyData',
      'fetchAbData'
    ]),

    updateCompanyList () {
      const key = this.test
      const companyList = this.companyData[key]

      if (companyList) {
        this.companies = companyList
      } else {
        this.fetchCompanyData({ key })
        this.companies = this.companyData[key]
      }
    },

    updateTable () {
      const list = this.abData

      if (list) {
        this.tableData = list
      } else {
        this.fetchAbData
        this.tableData = this.abData
      }
    },

    onClickAdd () {
      this.$refs.dataDialog.open('add')
    },

    onClickEdit (item) {
      this.$refs.dataDialog.open('edit', item)
    },

    onClickDelete (item) {
      this.$refs.deleteDialog.open(item)
    }
  },

  created () {
    this.updateCompanyList()
    this.updateTable()
  }
}
</script>
