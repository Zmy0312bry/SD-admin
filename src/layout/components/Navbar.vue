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
          <div v-if="!avatar || avatar === 'false'" class="avatar-icon-wrapper">
            <i class="el-icon-user-solid avatar-icon" />
          </div>
          <img v-else :src="userAvatar" class="user-avatar">
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
          <div class="avatar-preview-wrapper">
            <div
              v-if="!editForm.avatar && !avatarPreviewUrl"
              class="avatar-preview-icon"
            >
              <i class="el-icon-user-solid" />
            </div>
            <img
              v-else
              :src="avatarPreviewUrl || defaultAvatar"
              class="avatar-preview"
            >
          </div>
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
              {{ avatarLoading ? "上传中..." : "选择头像" }}
            </el-button>
          </el-upload>
          <p v-if="uploadStatus" class="upload-status">{{ uploadStatus }}</p>
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
          <el-form-item label="手机号" prop="phone_number">
            <el-input
              v-model="editForm.phone_number"
              placeholder="请输入手机号"
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
import { fetchMediaObjectUrl } from '@/utils/media'

const DEFAULT_AVATAR = ''

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
        callback(new Error('密码长度不能少于 6 位'))
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
    const validatePhoneNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号格式'))
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
      uploadStatus: '',
      avatarBlobUrl: '',
      editFormAvatarBlobUrl: '',
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
      editRules: {
        phone_number: [
          { required: true, validator: validatePhoneNumber, trigger: 'blur' }
        ]
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
      // 如果有 Blob URL（携带 token），直接使用
      if (this.avatarBlobUrl) {
        return this.avatarBlobUrl
      }
      // 如果没有头像或头像为 false，返回空字符串（显示默认 icon）
      if (!this.avatar || this.avatar === 'false') {
        return ''
      }
      // 否则返回空字符串，等待 loadAvatar 加载 Blob URL
      // 这样可以确保所有头像请求都通过 axios 携带 token
      return ''
    },
    userName() {
      return this.name || this.nickname || '用户'
    },
    avatarPreviewUrl() {
      // 如果有 Blob URL（携带 token），直接使用
      if (this.editFormAvatarBlobUrl) {
        return this.editFormAvatarBlobUrl
      }
      // 如果有上传后的头像预览（新上传的头像），使用它
      if (this.editForm.avatarPreview) {
        return this.editForm.avatarPreview
      }
      // 如果没有头像或头像为 false，返回空字符串（显示默认 icon）
      return ''
    }
  },
  watch: {
    // 监听 avatar 变化，自动重新加载头像
    avatar(newVal) {
      if (newVal && newVal !== 'false') {
        this.loadAvatar()
      }
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
        // 获取用户信息后加载头像
        await this.loadAvatar()
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },
    async loadAvatar() {
      // 释放旧的 Blob URL
      if (this.avatarBlobUrl) {
        URL.revokeObjectURL(this.avatarBlobUrl)
        this.avatarBlobUrl = ''
      }
      // 如果有头像且不是 false，加载 Blob URL（通过 axios 携带 token）
      if (this.avatar && this.avatar !== 'false') {
        // 判断是否为 UUID 格式
        if (/^[a-fA-F0-9-]{8,}$/.test(this.avatar)) {
          try {
            this.avatarBlobUrl = await fetchMediaObjectUrl(this.avatar)
          } catch (error) {
            console.error('加载头像失败:', error)
          }
        } else {
          // 如果不是 UUID，可能是完整 URL，直接使用
          this.avatarBlobUrl = this.avatar
        }
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
      this.editForm.avatarPreview = ''
      // 释放旧的编辑弹窗头像 Blob URL
      if (this.editFormAvatarBlobUrl) {
        URL.revokeObjectURL(this.editFormAvatarBlobUrl)
        this.editFormAvatarBlobUrl = ''
      }
      // 如果有头像且不是 false，加载 Blob URL（通过 axios 携带 token）
      if (this.avatar && this.avatar !== 'false') {
        // 判断是否为 UUID 格式
        if (/^[a-fA-F0-9-]{8,}$/.test(this.avatar)) {
          try {
            this.editFormAvatarBlobUrl = await fetchMediaObjectUrl(this.avatar)
          } catch (error) {
            console.error('加载头像预览失败:', error)
          }
        } else {
          // 如果不是 UUID，可能是完整 URL，直接使用
          this.editFormAvatarBlobUrl = this.avatar
        }
      }
      this.editProfileDialogVisible = true
      // 清除表单验证
      this.$nextTick(() => {
        if (this.$refs.editForm) {
          this.$refs.editForm.clearValidate()
        }
      })
    },
    async handleAvatarChange(file) {
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

      // 直接上传头像
      this.avatarLoading = true
      this.uploadStatus = '正在上传...'
      try {
        const uploadResult = await uploadAvatar(file.raw)
        // 后端返回格式：{ media: { uuid: '...', type: '...' }, code: 200 }
        const uuid = uploadResult.media?.uuid || uploadResult.data?.media?.uuid
        if (uuid) {
          this.editForm.avatar = uuid
          this.uploadStatus = '上传成功，UUID: ' + uuid.substring(0, 8) + '...'
          // 使用返回的 UUID 生成预览 URL（带 token）
          this.editForm.avatarPreview = await fetchMediaObjectUrl(uuid)
          this.$message.success('头像上传成功')
        } else {
          throw new Error('未获取到头像 UUID')
        }
      } catch (error) {
        console.error('头像上传失败:', error)
        this.$message.error(error.message || '头像上传失败')
        this.uploadStatus = '上传失败'
      } finally {
        this.avatarLoading = false
        // 重置文件选择，允许重复选择同一文件
        this.$refs.avatarUpload.clearFiles()
      }
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

      // 验证手机号
      if (!this.editForm.phone_number || !this.editForm.phone_number.trim()) {
        this.$message.warning('请输入手机号')
        return
      }
      if (!/^1[3-9]\d{9}$/.test(this.editForm.phone_number)) {
        this.$message.warning('请输入正确的手机号格式')
        return
      }

      this.editLoading = true
      try {
        // 更新用户信息（头像已在 handleAvatarChange 中上传并获取 UUID）
        const result = await updateUserInfo(this.editForm)
        this.$message.success(result.message || '修改成功')

        // 释放编辑弹窗的头像 Blob URL
        if (this.editFormAvatarBlobUrl) {
          URL.revokeObjectURL(this.editFormAvatarBlobUrl)
          this.editFormAvatarBlobUrl = ''
        }

        this.editProfileDialogVisible = false
        this.uploadStatus = ''

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
      // 释放头像 Blob URL
      if (this.avatarBlobUrl) {
        URL.revokeObjectURL(this.avatarBlobUrl)
      }
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

        .avatar-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #409eff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;

          .avatar-icon {
            font-size: 24px;
            color: #fff;
          }
        }

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

    .avatar-preview-wrapper {
      display: inline-block;
      position: relative;

      .avatar-preview-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #f5f7fa;
        border: 1px dashed #dcdfe6;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 40px;
          color: #c0c4cc;
        }
      }

      .avatar-preview {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid #dcdfe6;
      }
    }

    .avatar-uploader {
      margin-top: 10px;
    }

    .upload-status {
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
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
