import axios from 'axios'

// axiosのインスタンス作成
const gasApi = axios.create({
  headers: { 'content-type': 'application/x-www-form-urlencoded' }
})

// response共通処理
// errorが含まれていたらrejectする
gasApi.interceptors.response.use(res => {
  if (res.data.error) {
    return Promise.reject(res.data.error)
  }
  return Promise.resolve(res)
}, err => {
  return Promise.reject(err)
})

/**
 * APIのURLを設定します
 * @param {String} url
 */
const setUrl = url => {
  gasApi.defaults.baseURL = url
}

/**
 * authTokenを設定します
 * @param {String} token
 */
// eslint-disable-next-line no-unused-vars
let authToken = ''
const setAuthToken = token => {
  authToken = token
}

/**
 * 指定フォルダ内の会社別ファイルを取得します
 * @returns 
 */
const getCompany = () => {
  return gasApi.get('')
}

/**
 * 指定ファイル内にあるシートの一覧(名前)を取得します
 * @param {*} sheetId 
 * @returns 
 */
const getSheetName = sheetId => {
  return gasApi.post('', {
    method: 'GETNAME',
    authToken,
    params: {
      sheetId
    }
  })
}

/**
 * 指定したデータの一覧を取得します
 * @param {*} sheetId 
 * @param {*} sheetName 
 * @returns 
 */
const fetch = (sheetId, sheetName) => {
  return gasApi.post('', {
    method: 'GET',
    authToken,
    params: {
      sheetId,
      sheetName
    }
  })
}

/**
 * データを追加します
 * @param {*} item 
 * @param {*} sheetId 
 * @param {*} sheetName 
 * @returns 
 */
const add = (item, sheetId, sheetName) => {
  return gasApi.post('', {
    method: 'POST',
    authToken,
    params: {
      item,
      sheetId,
      sheetName
    }
  })
}

/**
 * データを更新します
 * @param {*} item 
 * @param {*} sheetId 
 * @param {*} sheetName 
 * @returns 
 */
const update = (item, sheetId, sheetName) => {
  return gasApi.post('', {
    method: 'PUT',
    authToken,
    params: {
      item,
      sheetId,
      sheetName
    }
  })
}

/**
 * 指定idのデータを削除します
 * @param {*} sheetId 
 * @param {*} sheetName 
 * @param {*} id 
 * @returns 
 */
const $delete = (sheetId, sheetName, id) => {
  return gasApi.post('', {
    method: 'DELETE',
    authToken,
    params: {
      sheetId,
      sheetName,
      id
    }
  })
}

export default {
  setUrl,
  setAuthToken,
  getCompany,
  getSheetName,
  fetch,
  add,
  update,
  delete: $delete,
}