// proto 文件路径配置
const protoConfig = {
  user: {
    path: '@/api/proto/user.proto',
    messages: {
      // 登录相关
      PasswordLoginRequest: {
        request: true,
        responseType: 'PasswordLoginResponse'
      },
      PasswordLoginResponse: {
        request: false
      },

      // 用户信息相关
      UserRequest: {
        request: true,
        responseType: 'UserResponse'
      },
      UserResponse: {
        request: false
      },
      User: {
        request: false
      },

      // 权限申请相关
      ApplyPermission: {
        request: true,
        responseType: 'ApplyPermissionResponse'
      },
      ApplyPermissionResponse: {
        request: false
      },

      // 管理员管理相关
      AdminManagedUser: {
        request: false
      },
      AdminManagerResponse: {
        request: false
      },

      // 修改密码相关
      ChangePasswordRequest: {
        request: true,
        responseType: 'ChangePasswordResponse'
      },
      ChangePasswordResponse: {
        request: false
      }
    }
  }
}

export default protoConfig
