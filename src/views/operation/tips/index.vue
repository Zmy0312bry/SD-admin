<template>
  <div class="tips-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>温馨提示管理</span>
        <el-button
          v-if="hasNotice"
          type="primary"
          icon="el-icon-edit"
          style="float: right"
          @click="showEditDialog"
        >编辑</el-button>
        <el-button
          v-else
          type="primary"
          icon="el-icon-plus"
          style="float: right"
          @click="showEditDialog"
        >新增</el-button>
      </div>

      <!-- 加载状态 -->
      <div v-loading="loading" class="tips-content">
        <!-- 无数据 -->
        <div v-if="!loading && !hasNotice" class="empty-placeholder">
          <i class="el-icon-document" />
          <p>暂无温馨提示</p>
        </div>

        <!-- 显示温馨提示 -->
        <div v-else-if="!loading && hasNotice" class="notice-display">
          <div class="notice-icon">
            <i class="el-icon-bell" />
          </div>
          <div class="notice-content">
            <h3>温馨提示</h3>
            <p class="notice-text">{{ noticeContent }}</p>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 编辑/新增对话框 -->
    <el-dialog
      :title="hasNotice ? '编辑温馨提示' : '新增温馨提示'"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="提示内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="5"
            placeholder="请输入温馨提示内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNotice, addNotice } from '@/api/operation'

export default {
  name: 'Tips',
  data() {
    return {
      loading: false,
      submitLoading: false,
      hasNotice: false,
      noticeId: null,
      noticeContent: '',
      dialogVisible: false,
      form: {
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入提示内容', trigger: 'blur' },
          {
            min: 1,
            max: 500,
            message: '长度在 1 到 500 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.fetchNotice()
  },
  methods: {
    // 获取温馨提示
    async fetchNotice() {
      this.loading = true
      try {
        const result = await getNotice()
        console.log('获取温馨提示:', result)

        if (result.notice && result.notice.content) {
          this.hasNotice = true
          this.noticeId = result.notice.id
          this.noticeContent = result.notice.content
        } else {
          this.hasNotice = false
          this.noticeId = null
          this.noticeContent = ''
        }
      } catch (error) {
        console.error('获取温馨提示失败:', error)
        // 如果是 404 或类似错误，说明没有温馨提示
        this.hasNotice = false
      } finally {
        this.loading = false
      }
    },

    // 显示编辑对话框
    showEditDialog() {
      this.form.content = this.noticeContent || ''
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    // 提交表单
    async handleSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return

        this.submitLoading = true
        try {
          const result = await addNotice(this.form.content)
          console.log('提交结果:', result)

          this.$message.success(result.message || '操作成功')
          this.dialogVisible = false

          // 刷新列表
          await this.fetchNotice()
        } catch (error) {
          console.error('操作失败:', error)
          this.$message.error(error.message || '操作失败')
        } finally {
          this.submitLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tips-container {
  padding: 20px;
  min-height: 500px;

  .tips-content {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;

    .empty-placeholder {
      text-align: center;
      padding: 60px 20px;
      color: #909399;

      i {
        font-size: 64px;
        margin-bottom: 16px;
        display: block;
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    .notice-display {
      width: 100%;
      max-width: 600px;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
      display: flex;
      align-items: flex-start;
      gap: 20px;

      .notice-icon {
        width: 60px;
        height: 60px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        i {
          font-size: 32px;
          color: #fff;
        }
      }

      .notice-content {
        flex: 1;
        color: #fff;

        h3 {
          margin: 0 0 15px;
          font-size: 20px;
          font-weight: 600;
        }

        .notice-text {
          margin: 0;
          font-size: 16px;
          line-height: 1.8;
          white-space: pre-wrap;
          word-break: break-word;
        }
      }
    }
  }
}
</style>
