import Vue from 'vue'
import Vuex from 'vuex'
import gasApi from '../api/gasApi'

Vue.use(Vuex)

/**
 * State
 * Vuexの状態
 */
const state = {
  /** 会社ごとのファイル */
  companyData: {},
  /** シートの一覧 */
  sheetData: {},
  /** データ */
  abData: {},
  /** ローディング状態 */
  loading: {
    getCompany: false,
    getSheetName: false,
    fetch: false,
    add: false,
    update: false,
  },
  /** エラーメッセージ */
  errorMessage: '',
  /** 設定 */
  settings: {
    appName: 'testApp',
    apiUrl: '',
    authToken: '',
    strCategoryItems: '問い合わせ, トラブル',
    strMountItems: 'TEST1001, TEST1002, TEST1003',
    strRemoveItems: 'TEST1001, TEST1002, TEST1003',
  }
}

/**
 * Mutations
 * ActionsからStateを更新するとき呼ばれる
 */
const mutations = {
  /** v-selectの会社別ファイルのデータをセット */
  setCompanyData (state, { key,  companyList }) {
    state.companyData[key] = companyList
  },

  /** シート名を指定してセットします */
  setSheetData (state, { sheetId, sheetNameList }) {
    state.sheetData[sheetId] = sheetNameList
  },

  /** 指定シートのデータをセットします */
  setAbData (state, { sheetName, list }) {
    state.abData[sheetName] = list
  },

  addAbData (state, { item, sheetName }) {
    const list = state.abData[sheetName]
    if (list) {
      list.push(item)
    }
  },

  updateAbData (state, { item, sheetName }) {
    const list = state.abData[sheetName]
    if (list) {
      const index = list.findIndex(V => V.id === item.id)
      list.splice(index, 1, item)
    }
  },

  deleteAbData (state, { sheetName, id }) {
    const list = state.abData[sheetName]
    if (list) {
      const index = list.findIndex(v => v.id === id)
      list.splice(index, 1)
    }
  },

  /** ローディング状態のセット */
  setLoading ( state, { type, v }) {
    state.loading[type] = v
  },

  /** エラーメッセージのセット */
  setErrorMessage ( state, { message }) {
    state.errorMessage = message
  },

  /** 設定を保存します */
  saveSettings (state, { settings }) {
    state.settings = { ...settings }
    const { appName, apiUrl, authToken} = state.settings
    document.title = appName
    gasApi.setUrl(apiUrl)
    gasApi.setAuthToken(authToken)
    //テーブルデータを初期化
    state.abData = {}

    localStorage.setItem('settings', JSON.stringify(settings))
  },

  /** 設定を読み込みます */
  loadSettings (state) {
    const settings = JSON.parse(localStorage.getItem('settings'))
    if (settings) {
      state.settings = Object.assign(state.settings, settings)
    }
    const { appName, apiUrl, authToken} = state.settings
    document.title = appName
    gasApi.setUrl(apiUrl)
    gasApi.setAuthToken(authToken)
  }
}

/**
 * Actions
 * 画面から呼ばれ、Mutationをコミットします
 */
const actions = {
  /** 会社別のファイルを取得します */
  async fetchCompanyData ({ commit }, { key }) {
    const type = 'getCompany'
    commit('setLoading', { type, v: true })
    try {
      const res = await gasApi.getCompany(key)
      commit('setCompanyData', { key,  companyList: res.data })
    } catch (e) {
      commit('setErrorMessage', { message: e })
      commit('setCompanyData', { key, companyList: [] })
    } finally {
      commit('setLoading', { type, v: false })
    }
  },

  /** 指定ファイルのシート名一覧を取得します */
  async fetchSheetData ({ commit }, { sheetId }) {
    const type = 'getSheetName'
    commit('setLoading', { type, v: true })
    try {
      const res = await gasApi.getSheetName(sheetId)
      commit('setSheetData', { sheetId, sheetNameList: res.data })
    } catch (e) {
      commit('setErrorMessage', { message: e })
      commit('setSheetData', { sheetId, sheetNameList: [] })
    } finally {
      commit('setLoading', { type, v: false })
    }
  },

  /** 指定シートのデータを取得します */
  async fetchAbData ({ commit }, { sheetId, sheetName }) {
    const type = 'fetch'
    commit('setLoading', { type, v: true })
    try {
      const res = await gasApi.fetch(sheetId, sheetName)
      commit('setAbData', { sheetName, list: res.data })
    } catch (e) {
      commit('setErrorMessage', { message: e })
      commit('setAbData', { sheetName, list: [] })
    } finally {
      commit('setLoading', { type, v: false })
    }
  },

  /** データを追加します */
  async addAbData ({ commit }, { item, sheetId, sheetName }) {
    const type = 'add'
    commit('setLoading', { type, v: true })
    try {
      const res = await gasApi.add(item, sheetId, sheetName)
      commit('addAbData', { sheetName, item: res.data })
    } catch (e) {
      commit('setErrorMessage', { message: e })
    } finally {
      commit('setLoading', { type, v: false })
    }
  },

  /** データを更新します */
  async updateAbData ({ commit }, { item, sheetId, sheetName }) {
    const type = 'update'
    commit('setLoading', { type, v: true })
    try {
      const res = await gasApi.update(item, sheetId, sheetName)
      commit('updateAbData', { sheetName, item: res.data })
    } catch (e) {
      commit('setErrorMessage', { message: e })
    } finally {
      commit('setLoading', { type, v: false })
    }
  },

  /** データを削除します */
  async deleteAbData ({ commit }, { item, sheetId, sheetName }) {
    const type = 'delete'
    const id = item.id
    commit('setLoading', { type, v: true })
    try {
      await gasApi.delete(sheetId, sheetName, id)
      commit('deleteAbData', { sheetName, id })
    } catch (e) {
      commit('setErrorMessage', { message: e })
    } finally {
      commit('setLoading', { type, v: false })
    }
  },
  /** 設定を保存します */
  saveSettings ({ commit }, { settings }) {
    commit('saveSettings', { settings })
  },

  /** 設定を読み込みます */
  loadSettings ({ commit }) {
    commit('loadSettings')
  }
}

/** カンマ区切りの文字をトリミングして配列にします */
const createItems = v => v.split(',').map(v => v.trim()).filter(v => v.length !== 0)

/**
 * Getters
 * 画面から取得され、Stateを加工して渡します
 */
const getters = {
  categoryItems (state) {
    return createItems(state.settings.strCategoryItems)
  },
  mountItems (state) {
    return createItems(state.settings.strMountItems)
  },
  removeItems (state) {
    return createItems(state.settings.strRemoveItems)
  },
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
