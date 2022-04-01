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
 */
const getCompany = () => {
  return gasApi.get('')
}

/**
 * 指定ファイル内にあるシートの一覧(名前)を取得します
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


export default {
  setUrl,
  setAuthToken,
  getCompany,
  getSheetName
}