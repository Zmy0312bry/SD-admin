<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="userAvatar" class="user-avatar">
          <span class="user-name">{{ userName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="showEditProfileDialog">
            修改个人信息
          </el-dropdown-item>
          <el-dropdown-item @click.native="showChangePasswordDialog">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="handleLogout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改个人信息弹窗 -->
    <el-dialog
      title="修改个人信息"
      :visible.sync="editProfileDialogVisible"
      width="450px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="profile-dialog-content">
        <div class="avatar-upload">
          <img :src="avatarPreviewUrl" class="avatar-preview">
          <el-upload
            ref="avatarUpload"
            class="avatar-uploader"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            accept="image/*"
          >
            <el-button
              size="small"
              type="primary"
              :loading="avatarLoading"
              style="margin-top: 10px"
            >
              {{ avatarLoading ? "上传中" : "选择头像" }}
            </el-button>
          </el-upload>
        </div>
        <el-form
          ref="editForm"
          :model="editForm"
          label-width="80px"
          style="margin-top: 20px"
        >
          <el-form-item label="昵称">
            <el-input v-model="editForm.nickname" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="editForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input
              v-model="editForm.phone_number"
              placeholder="请输入手机号"
              disabled
            />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="editForm.address" placeholder="请输入地址" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editProfileDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="editLoading"
          @click="handleUpdateProfile"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordDialogVisible"
      width="400px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="password-dialog-content">
        <div class="phone-reminder">
          <i class="el-icon-mobile-phone" />
          <span>当前手机号：{{ phone_number }}</span>
        </div>
        <p class="reminder-text">请记住您的手机号和新密码，登录时需要使用</p>
        <el-form
          ref="passwordForm"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="80px"
          style="margin-top: 20px"
        >
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="passwordForm.password"
              type="password"
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="changePasswordDialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          :loading="passwordLoading"
          @click="handleChangePassword"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { changePassword, updateUserInfo, uploadAvatar } from '@/api/user'
import { getAvatarUrl } from '@/utils/media'

const DEFAULT_AVATAR =
  'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      defaultAvatar: DEFAULT_AVATAR,
      editProfileDialogVisible: false,
      changePasswordDialogVisible: false,
      editLoading: false,
      passwordLoading: false,
      avatarLoading: false,
      avatarFile: null,
      editForm: {
        nickname: '',
        name: '',
        phone_number: '',
        avatar: '',
        address: ''
      },
      passwordForm: {
        password: '',
        confirmPassword: ''
      },
      passwordRules: {
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validateConfirmPassword,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'nickname',
      'name',
      'phone_number',
      'address'
    ]),
    userAvatar() {
      return getAvatarUrl(this.avatar, this.defaultAvatar)
    },
    userName() {
      return this.name || this.nickname || '用户'
    },
    avatarPreviewUrl() {
      // 如果有新选择的头像预览，显示预览图
      if (this.editForm.avatarPreview) {
        return this.editForm.avatarPreview
      }
      // 否则显示当前头像
      return getAvatarUrl(this.editForm.avatar, this.defaultAvatar)
    }
  },
  mounted() {
    this.fetchUserInfo()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async fetchUserInfo() {
      try {
        await this.$store.dispatch('user/getInfo')
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },
    async showEditProfileDialog() {
      // 确保用户信息已加载
      if (!this.name && !this.nickname) {
        try {
          await this.fetchUserInfo()
        } catch (error) {
          this.$message.error('获取用户信息失败，请刷新页面重试')
          return
        }
      }

      this.editForm = {
        nickname: this.nickname || '',
        name: this.name || '',
        phone_number: this.phone_number || '',
        avatar: this.avatar || '',
        address: this.address || ''
      }
      this.avatarFile = null
      this.editProfileDialogVisible = true
    },
    handleAvatarChange(file) {
      // 验证文件类型
      const isImage = file.raw.type.startsWith('image/')
      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return
      }
      // 验证文件大小（限制为 2MB）
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return
      }
      this.avatarFile = file.raw
      // 预览图片
      const reader = new FileReader()
      reader.onload = (e) => {
        this.editForm.avatarPreview = e.target.result
      }
      reader.readAsDataURL(file.raw)
    },
    async handleUpdateProfile() {
      // 表单验证
      if (!this.editForm.nickname || !this.editForm.nickname.trim()) {
        this.$message.warning('请输入昵称')
        return
      }
      if (!this.editForm.name || !this.editForm.name.trim()) {
        this.$message.warning('请输入姓名')
        return
      }

      this.editLoading = true
      try {
        // 如果有新选择的头像文件，先上传头像
        if (this.avatarFile) {
          this.avatarLoading = true
          try {
            const uploadResult = await uploadAvatar(this.avatarFile)
            // 假设返回 { avatar: 'uuid' }
            this.editForm.avatar =
              uploadResult.avatar || uploadResult.data?.avatar || ''
            this.$message.success('头像上传成功')
          } catch (error) {
            this.$message.error(error.message || '头像上传失败')
            this.avatarLoading = false
            this.editLoading = false
            return
          } finally {
            this.avatarLoading = false
          }
        }

        // 更新用户信息
        const result = await updateUserInfo(this.editForm)
        this.$message.success(result.message || '修改成功')
        this.editProfileDialogVisible = false

        // 重新获取用户信息以更新界面
        await this.$store.dispatch('user/getInfo')
      } catch (error) {
        console.error('修改个人信息失败:', error)
        this.$message.error(error.message || '修改失败，请稍后重试')
      } finally {
        this.editLoading = false
      }
    },
    showChangePasswordDialog() {
      this.passwordForm = {
        password: '',
        confirmPassword: ''
      }
      this.changePasswordDialogVisible = true
      this.$nextTick(() => {
        this.$refs.passwordForm && this.$refs.passwordForm.clearValidate()
      })
    },
    async handleChangePassword() {
      this.$refs.passwordForm.validate(async(valid) => {
        if (!valid) return

        this.passwordLoading = true
        try {
          const result = await changePassword({
            password: this.passwordForm.password
          })
          this.$message.success(result.message || '密码修改成功')
          this.changePasswordDialogVisible = false
        } catch (error) {
          this.$message.error(error.message || '修改失败')
        } finally {
          this.passwordLoading = false
        }
      })
    },
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('user/resetToken')
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .user-name {
          cursor: pointer;
          margin-left: 10px;
          font-size: 14px;
          color: #5a5e66;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.profile-dialog-content {
  .avatar-upload {
    text-align: center;

    .avatar-preview {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #dcdfe6;
    }

    .avatar-uploader {
      margin-top: 10px;
    }
  }
}

.password-dialog-content {
  .phone-reminder {
    text-align: center;
    font-size: 16px;
    color: #409eff;
    margin-bottom: 10px;

    i {
      margin-right: 8px;
    }
  }

  .reminder-text {
    text-align: center;
    font-size: 12px;
    color: #909399;
    margin: 0;
  }
}
</style>
