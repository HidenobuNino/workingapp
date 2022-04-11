<template>
  <div>
    <v-card>
      <v-card-title>
        <!-- ファイル選択 -->
        <v-col cols="6">
          <v-select
            v-model="e1"
            item-text="name"
            :items="companies"
            menu-props="{ offsetY: true }"
            label="閲覧するデータを選択します"
            hide-details
            prepend-icon="mdi-folder-account"
            return-object
            @change="updateSheetNameList()"
          ></v-select>
        </v-col>

        <v-spacer/>
        <!-- シート選択 -->
        <v-col cols="6">
          <v-card-actions class="ma-4">
            <v-radio-group v-model="e2">
              <v-radio
                v-for="sheet in sheets"
                :key="sheet.sheetName"
                :value="sheet"
                :label="`${sheet.sheetName}`"
                @click="updateTable()"
              >
              </v-radio>
            </v-radio-group>
          </v-card-actions>
        </v-col>
        <!-- 検索フォーム -->
        <v-col cols="8">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </v-col>
        <!-- 追加ボタン -->
        <v-col class="text-right" cols="4">
          <v-btn dark color="blue" @click="onClickAdd">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
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
      <template v-slot:[`item.memo`]="{ item }">
        <div style="white-space: pre;">{{ item.memo }}</div>
      </template>
      <!-- 写真ボタン -->
      <template v-slot:[`item.photo`]="{ item }">
        <v-icon @click="onClickCamera(item.photo)">mdi-camera-outline</v-icon>
      </template>
      <!-- 追加／編集ボタン -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="onClickEdit(item)">mdi-pencil</v-icon>
        <v-icon @click="onClickDelete(item)">mdi-delete</v-icon>
      </template>
      </v-data-table>
    </v-card>
    <!-- 追加／編集ダイアログ -->
    <data-dialog :ids="e1" :names="e2" ref="dataDialog"/>
    <!-- 削除ダイアログ -->
    <delete-dialog :ids="e1" :names="e2" ref="deleteDialog"/>
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
      /** 検索文字 */
      search: '',
      e1: '',
      e2: '',
      test: 'tableKey',
      /** v-selectに表示されるデータ */
      companies: [],
      /** v-radioに表示されるデータ */
      sheets: [],
      /** テーブルに表示させるデータ */
      tableData: []
    }
  },

  computed: {
    ...mapState({
      /** データを取得 */
      companyData: state => state.companyData,
      sheetData: state => state.sheetData,
      abData: state => state.abData,
      /** ローディング状態 */
      loading: state => state.loading.getCompany || state.loading.getSheetName || state.loading.fetch
    }),


    /** テーブルのヘッダー設定 */
    tableHeaders () {
      return [
        { text: '日付', value: 'date', align: 'end' },
        { text: 'カテゴリ', value: 'category', sortable: false },
        { text: '取付部品', value: 'mounts', sortable: false },
        { text: '取外部品', value: 'removes', sortable: false },
        { text: '部品詳細', value: 'parts', sortable: false },
        { text: '部品No', value: 'serialNo', sortable: false },
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
      'fetchSheetData',
      'fetchAbData'
    ]),

    /** v-select 会社一覧の更新 */
    async updateCompanyList () {
      const key = this.test
      const companyList = this.companyData[key]

      if (companyList) {
        this.companies = companyList
      } else {
        await this.fetchCompanyData({ key })
        this.companies = this.companyData[key]
      }
    },

    /** v-radio シート一覧の更新 */
    async updateSheetNameList () {
      const sheetId = this.e1.sheetId
      const sheetNameList = this.sheetData[sheetId]

      if (sheetNameList) {
        this.sheets = sheetNameList
      } else {
        await this.fetchSheetData({ sheetId })
        this.sheets = this.sheetData[sheetId]
      }
    },

    /** v-data-table テーブル一覧の更新 */
    async updateTable () {
      const sheetId = this.e1.sheetId
      const sheetName = this.e2.sheetName
      const list = this.abData[sheetName]

      if (list) {
        this.tableData = list
      } else {
        await this.fetchAbData({ sheetId, sheetName })
        this.tableData = this.abData[sheetName]
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
    },

    onClickCamera (item) {
      const url = `https://drive.google.com/file/d/${ item }/view`
      window.open(url, '_blank', 'noreferrer')
    }
  },

  created () {
    this.updateCompanyList()
  }
}
</script>
