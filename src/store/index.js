import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * State
 * Vuexの状態
 */
const state = {
  /** 設定 */
  settings: {
    appName: 'testApp',
    apiUrl: '',
    authToken: '',
    strMountItems: 'TEST1001, TEST1002, TEST1003',
    strRemoveItems: 'TEST1001, TEST1002, TEST1003',
    strTagItem: '問い合わせ, トラブル'
  }
}

/**
 * Mutations
 * ActionsからStateを更新するとき呼ばれる
 */
const mutations = {
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
  /** 設定を保存します */
  saveSettings ({ commit }, { settings}) {
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
  mountItems (state) {
    return createItems(state.settings.strMountItems)
  },
  RemoveItems (state) {
    return createItems(state.settings.strRemoveItems)
  },
  tagItems (state) {
    return createItems(state.settings.strTagItems)
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
