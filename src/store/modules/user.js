import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    nickname: '',
    phone_number: '',
    address: '',
    is_important: '',
    permission: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_PHONE_NUMBER: (state, phone_number) => {
    state.phone_number = phone_number
  },
  SET_ADDRESS: (state, address) => {
    state.address = address
  },
  SET_IS_IMPORTANT: (state, is_important) => {
    state.is_important = is_important
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  },
  SET_USER_INFO: (state, userInfo) => {
    state.token = userInfo.token || state.token
    state.name = userInfo.name || ''
    state.nickname = userInfo.nickname || ''
    state.avatar = userInfo.avatar || ''
    // 支持驼峰命名 phoneNumber 和下划线命名 phone_number
    state.phone_number = userInfo.phoneNumber || userInfo.phone_number || ''
    state.address = userInfo.address || ''
    // 支持驼峰命名 isImportant 和下划线命名 is_important
    state.is_important = userInfo.isImportant || userInfo.is_important || ''
    state.permission = userInfo.permission || ''
  }
}

const actions = {
  // user login - 使用 Proto 序列化
  login({ commit }, userInfo) {
    const { phone_number, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone_number: phone_number.trim(), password })
        .then((response) => {
          // response 结构：{ user: { token, nickname, phone_number, ... }, code: 200, message: 'login success' }
          const { user, code } = response

          if (code !== 200) {
            reject(new Error(response.message || '登录失败'))
            return
          }

          // 保存用户信息
          if (user) {
            // 从 user 对象中提取 token 并保存到本地
            if (user.token) {
              commit('SET_TOKEN', user.token)
              setToken(user.token)
            }
            // 保存其他用户信息
            commit('SET_USER_INFO', user)
          }

          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info - 使用 Proto 序列化
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((response) => {
          // response 结构：{ user: {...}, code: 200, message: '' }
          const { user, code } = response

          if (code !== 200) {
            return reject(new Error(response.message || '获取用户信息失败'))
          }

          if (!user) {
            return reject(
              new Error('Verification failed, please Login again.')
            )
          }

          // 保存用户信息
          commit('SET_USER_INFO', user)

          resolve(user)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout - 前端跳转，不需要后端接口
  logout({ commit }) {
    return new Promise((resolve) => {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove token first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
