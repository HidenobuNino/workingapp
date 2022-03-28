import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * State
 * Vuexの状態
 */
const state = {
  /** 会社ごとのファイル */
  companyData: {},
  /** データ */
  abData: [],
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
  setCompanyData (state, { key,  companyList }) {
    state.companyData[key] = companyList
  },

  /** 指定シートのデータをセットします */
  setAbData (state, { list }) {
    state.abData = list
  },

  addAbData (state, { item }) {
    const list = state.abData
    if (list) {
      list.push(item)
    }
  },

  updateAbData (state, { item }) {
    const list = state.abData
    if (list) {
      const index = list.findIndex(V => V.id === item.id)
      list.splice(index, 1, item)
    }
  },

  deleteAbData (state, { id }) {
    const list = state.abData
    if (list) {
      const index = list.findIndex(v => v.id === id)
      list.splice(index, 1)
    }
  },

  /** 設定を保存します */
  saveSettings (state, { settings }) {
    state.settings = { ...settings }
    document.title = state.settings.appName

    localStorage.setItem('settings', JSON.stringify(settings))
  },

  /** 設定を読み込みます */
  loadSettings (state) {
    const settings = JSON.parse(localStorage.getItem('settings'))
    if (settings) {
      state.settings = Object.assign(state.settings, settings)
    }

    document.title = state.settings.appName
  }
}

/**
 * Actions
 * 画面から呼ばれ、Mutationをコミットします
 */
const actions = {
  /** 会社別のファイルを取得します */
  fetchCompanyData ({ commit }, { key }) {
    const companyList = [
      { name: 'company1', sheetId: 'xxxxxxxxxxx'},
      { name: 'company2', sheetId: 'xxxxxxxxxx'}
    ]

    commit('setCompanyData', { key,  companyList })
  },

  /** 指定シートのデータを取得します */
  fetchAbData ({ commit }) {
    // サンプルデータ
    const list = [
      { id: 'a34109ed', date: '2020-06-01', category: 'トラブル', mounts: 'TEST1001', removes: 'TEST1001',  memo: 'メモメモメモメモメモメモメ' },
      { id: '7c8fa764', date: '2020-06-02', category: '問い合わせ', mounts: 'TEST1001', removes: 'TEST1001',  memo: 'メモ' },
    ]

    commit('setAbData', { list })
  },

  /** データを追加します */
  addAbData ({ commit }, { item }) {
    commit('addAbData', { item })
  },

  /** データを更新します */
  updateAbData ({ commit }, { beforeYM, item }) {
    const date = item.date
    if (date === beforeYM) {
      commit('updateAbData', { date, item })
      return
    }
    const id = item.id
    commit('deleteAbData', { date: beforeYM, id })
    commit('addAbData', { item })
  },

  /** データを削除します */
  deleteAbData ({ commit }, { item }) {
    const id = item.id
    commit('deleteAbData', { id })
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
