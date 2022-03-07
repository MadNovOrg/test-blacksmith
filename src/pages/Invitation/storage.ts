import { ICognitoStorage } from 'amazon-cognito-identity-js'

const store = new Map()

const storage: ICognitoStorage = {
  setItem: (key, value) => {
    store.set(key, value)
  },
  getItem: key => store.get(key),
  removeItem: key => {
    store.delete(key)
  },
  clear: () => {
    store.clear()
  },
}

export default storage
