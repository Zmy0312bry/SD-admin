import request from '@/utils/request'
import proto from '@/utils/protobuf'

/**
 * 密码登录 - 使用 Proto 序列化
 * @param {Object} loginData - 登录数据 { phone_number, password }
 * @returns {Promise<Object>} - 返回解析后的用户信息
 */
export function login(loginData) {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        const protoBuffer = await proto.jsonToProto(
          'user',
          'PasswordLoginRequest',
          loginData
        )

        const response = await request({
          url: '/user/login',
          method: 'post',
          data: protoBuffer,
          responseType: 'arraybuffer',
          transformRequest: [(data) => data],
          headers: {
            'Content-Type': 'application/x-protobuf'
          }
        })

        const result = await proto.protoToJson(
          'user',
          'PasswordLoginResponse',
          response.data
        )

        if (result.code !== 200) {
          reject(new Error(result.message || '登录失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('登录失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 获取用户信息 - 使用 Proto 序列化
 * @returns {Promise<Object>} - 返回用户信息
 */
export function getInfo() {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        const response = await request({
          url: '/user/info',
          method: 'get',
          responseType: 'arraybuffer'
        })

        const result = await proto.protoToJson(
          'user',
          'UserResponse',
          response.data
        )

        if (result.code !== 200) {
          reject(new Error(result.message || '获取用户信息失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('获取用户信息失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 修改密码 - PUT /user/login
 * @param {Object} passwordData - 密码数据 { password: '新密码' }
 * @returns {Promise<Object>}
 */
export function changePassword(passwordData) {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        const protoBuffer = await proto.jsonToProto(
          'user',
          'ChangePasswordRequest',
          passwordData
        )

        const response = await request({
          url: '/user/login',
          method: 'put',
          data: protoBuffer,
          responseType: 'arraybuffer',
          transformRequest: [(data) => data],
          headers: {
            'Content-Type': 'application/x-protobuf'
          }
        })

        const result = await proto.protoToJson(
          'user',
          'ChangePasswordResponse',
          response.data
        )

        if (result.code !== 200) {
          reject(new Error(result.message || '修改密码失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('修改密码失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 修改个人信息 - PUT /user/info
 * @param {Object} userData - 用户数据 { nickname, name, phone_number, avatar, address }
 * @returns {Promise<Object>}
 */
export function updateUserInfo(userData) {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        const protoBuffer = await proto.jsonToProto(
          'user',
          'UserRequest',
          userData
        )

        const response = await request({
          url: '/user/info',
          method: 'put',
          data: protoBuffer,
          responseType: 'arraybuffer',
          transformRequest: [(data) => data],
          headers: {
            'Content-Type': 'application/x-protobuf'
          }
        })

        const result = await proto.protoToJson(
          'user',
          'UserResponse',
          response.data
        )

        if (result.code !== 200) {
          reject(new Error(result.message || '修改个人信息失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('修改个人信息失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 获取用户列表（管理员）- 使用 Proto 序列化
 * @returns {Promise<Object>} - 返回用户列表
 */
export function getUserList() {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        const response = await request({
          url: '/admin/user/list',
          method: 'get',
          responseType: 'arraybuffer'
        })

        const result = await proto.protoToJson(
          'user',
          'AdminManagerResponse',
          response.data
        )

        if (result.code !== 200) {
          reject(new Error(result.message || '获取用户列表失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('获取用户列表失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 申请权限 - 使用 Proto 序列化
 * @param {Object} applyData - 申请数据 { code, apply_type, expire_time }
 * @returns {Promise<Object>}
 */
export function applyPermission(applyData) {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        const protoBuffer = await proto.jsonToProto(
          'user',
          'ApplyPermission',
          applyData
        )

        const response = await request({
          url: '/user/apply_permission',
          method: 'post',
          data: protoBuffer,
          responseType: 'arraybuffer',
          transformRequest: [(data) => data],
          headers: {
            'Content-Type': 'application/x-protobuf'
          }
        })

        const result = await proto.protoToJson(
          'user',
          'ApplyPermissionResponse',
          response.data
        )

        if (result.code !== 200) {
          reject(new Error(result.message || '申请权限失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('申请权限失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 上传头像 - POST /multi_media?avatar=true
 * @param {File} file - 文件对象
 * @returns {Promise<Object>} - 返回上传结果 { avatar: 'uuid' }
 */
export function uploadAvatar(file) {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await request({
          url: '/multi_media?avatar=true',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.code !== 200) {
          reject(new Error(response.message || '上传头像失败'))
          return
        }

        resolve(response)
      } catch (error) {
        console.error('上传头像失败:', error)
        reject(error)
      }
    })()
  })
}
