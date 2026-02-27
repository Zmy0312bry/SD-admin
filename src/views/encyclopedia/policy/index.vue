<template>
  <div class="policy-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>养老政策管理</span>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="float: right"
          @click="showAddCategoryDialog"
        >
          新增目录
        </el-button>
      </div>

      <div class="policy-tree-wrapper">
        <el-tree
          ref="policyTree"
          :data="policyTree"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          node-key="id"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <!-- 一级目录 -->
            <div v-if="data.type === 'category'" class="category-node">
              <i class="el-icon-folder-opened category-icon" />
              <span class="node-label">{{ node.label }}</span>
              <span class="node-actions">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-plus"
                  @click="showAddPolicyDialog(data)"
                >
                  添加政策
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click="removeCategory(node, data)"
                >
                  删除目录
                </el-button>
              </span>
            </div>

            <!-- 政策条目 -->
            <div v-else class="policy-node">
              <i class="el-icon-document policy-icon" />
              <span class="node-label">{{ node.label }}</span>
              <span class="node-desc">{{
                data.description || "暂无描述"
              }}</span>
              <span class="node-actions">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-view"
                  @click="viewPolicy(data)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click="removePolicy(node, data)"
                >
                  删除
                </el-button>
              </span>
            </div>
          </span>
        </el-tree>
      </div>

      <!-- 新增目录对话框 -->
      <el-dialog
        title="新增政策目录"
        :visible.sync="addCategoryDialogVisible"
        width="500px"
        :close-on-click-modal="false"
        append-to-body
      >
        <el-form
          ref="categoryForm"
          :model="categoryForm"
          :rules="categoryRules"
          label-width="80px"
        >
          <el-form-item label="目录名称" prop="name">
            <el-input
              v-model="categoryForm.name"
              placeholder="请输入目录名称"
              maxlength="50"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddCategory">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 新增政策对话框 -->
      <el-dialog
        title="新增养老政策"
        :visible.sync="addPolicyDialogVisible"
        width="600px"
        :close-on-click-modal="false"
        append-to-body
      >
        <el-form
          ref="policyForm"
          :model="policyForm"
          :rules="policyRules"
          label-width="80px"
        >
          <el-form-item label="政策标题" prop="title">
            <el-input
              v-model="policyForm.title"
              placeholder="请输入政策标题"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item label="政策内容" prop="content">
            <el-input
              v-model="policyForm.content"
              type="textarea"
              :rows="6"
              placeholder="请输入政策内容"
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addPolicyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddPolicy">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Policy',
  data() {
    return {
      // 树形数据
      policyTree: [
        {
          id: 1,
          label: '养老服务政策',
          type: 'category',
          children: [
            {
              id: 11,
              label: '居家养老服务补贴政策',
              type: 'policy',
              description: '为居家老人提供生活照料、家政服务等方面的补贴'
            },
            {
              id: 12,
              label: '社区养老服务设施建设政策',
              type: 'policy',
              description: '支持社区养老服务中心、日间照料中心等设施建设'
            }
          ]
        },
        {
          id: 2,
          label: '医疗保障政策',
          type: 'category',
          children: [
            {
              id: 21,
              label: '老年人基本医疗保险政策',
              type: 'policy',
              description: '老年人基本医疗保险参保及相关待遇政策'
            },
            {
              id: 22,
              label: '长期护理保险政策',
              type: 'policy',
              description: '为失能老人提供长期护理保险保障'
            }
          ]
        },
        {
          id: 3,
          label: '文化娱乐政策',
          type: 'category',
          children: [
            {
              id: 31,
              label: '老年文化活动政策',
              type: 'policy',
              description: '组织开展适合老年人的文化娱乐活动'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 对话框状态
      addCategoryDialogVisible: false,
      addPolicyDialogVisible: false,

      // 表单数据
      categoryForm: {
        name: ''
      },
      policyForm: {
        title: '',
        content: '',
        categoryId: null
      },

      // 表单验证规则
      categoryRules: {
        name: [
          { required: true, message: '请输入目录名称', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      policyRules: {
        title: [
          { required: true, message: '请输入政策标题', trigger: 'blur' },
          {
            min: 5,
            max: 100,
            message: '长度在 5 到 100 个字符',
            trigger: 'blur'
          }
        ],
        content: [
          { required: true, message: '请输入政策内容', trigger: 'blur' },
          {
            min: 10,
            max: 1000,
            message: '长度在 10 到 1000 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 显示新增目录对话框
    showAddCategoryDialog() {
      this.categoryForm.name = ''
      this.addCategoryDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.categoryForm) {
          this.$refs.categoryForm.clearValidate()
        }
      })
    },

    // 确认添加目录
    handleAddCategory() {
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          const newId = Math.max(...this.policyTree.map((item) => item.id)) + 1
          const newCategory = {
            id: newId,
            label: this.categoryForm.name,
            type: 'category',
            children: []
          }
          this.policyTree.push(newCategory)
          this.$message.success('目录添加成功')
          this.addCategoryDialogVisible = false
        }
      })
    },

    // 显示新增政策对话框
    showAddPolicyDialog(category) {
      this.policyForm = {
        title: '',
        content: '',
        categoryId: category.id
      }
      this.addPolicyDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.policyForm) {
          this.$refs.policyForm.clearValidate()
        }
      })
    },

    // 确认添加政策
    handleAddPolicy() {
      this.$refs.policyForm.validate((valid) => {
        if (valid) {
          const category = this.policyTree.find(
            (item) => item.id === this.policyForm.categoryId
          )
          if (category) {
            const newId =
              Math.max(
                ...this.policyTree.flatMap((item) =>
                  item.children.map((child) => child.id)
                ),
                0
              ) + 1
            const newPolicy = {
              id: newId,
              label: this.policyForm.title,
              type: 'policy',
              description: this.policyForm.content.substring(0, 50) + '...',
              fullContent: this.policyForm.content
            }
            category.children.push(newPolicy)
            this.$message.success('政策添加成功')
            this.addPolicyDialogVisible = false
          }
        }
      })
    },

    // 删除目录
    removeCategory(node, data) {
      this.$confirm(`确定要删除目录'${data.label}'及其所有政策吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const index = this.policyTree.findIndex(
            (item) => item.id === data.id
          )
          if (index !== -1) {
            this.policyTree.splice(index, 1)
            this.$message.success('目录删除成功')
          }
        })
        .catch(() => {})
    },

    // 删除政策
    removePolicy(node, data) {
      this.$confirm(`确定要删除政策'${data.label}'吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const parent = node.parent
          const index = parent.data.children.findIndex(
            (item) => item.id === data.id
          )
          if (index !== -1) {
            parent.data.children.splice(index, 1)
            this.$message.success('政策删除成功')
          }
        })
        .catch(() => {})
    },

    // 查看政策详情
    viewPolicy(data) {
      this.$alert(data.fullContent || data.description, data.label, {
        confirmButtonText: '关闭',
        customClass: 'policy-detail-dialog'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.policy-container {
  padding: 20px;
  min-height: 600px;

  .policy-tree-wrapper {
    margin-top: 20px;
    padding: 20px;
    background: #fafafa;
    border-radius: 8px;

    // 完全自定义树节点样式 - 只使用自定义样式
    :deep(.el-tree) {
      background: transparent;
    }

    // 自定义树节点容器 - 完全独立的样式系统
    .custom-tree-node {
      display: block;
      width: 100%;

      // 一级目录样式 - 突出显示
      .category-node {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 14px 18px;
        margin: 8px 0;
        background: #fdf6ec;
        border: 1px solid #e6a23c;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-sizing: border-box;

        &:hover {
          box-shadow: 0 2px 12px rgba(230, 162, 60, 0.2);
          filter: brightness(0.98);
        }

        .category-icon {
          font-size: 20px;
          margin-right: 12px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e6a23c;
          color: #fff;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .node-label {
          font-size: 16px;
          font-weight: 700;
          color: #e6a23c;
          flex-shrink: 0;
          margin-right: 12px;
          white-space: nowrap;
        }

        .node-actions {
          margin-left: auto;
          padding-left: 12px;
          border-left: 1px solid rgba(230, 162, 60, 0.3);
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          align-items: center;

          // 增大操作按钮字号
          ::v-deep .el-button {
            font-size: 14px;
            padding: 6px 12px;
          }

          .delete-btn {
            color: #f56c6c;
            &:hover {
              color: #f56c6c;
            }
          }
        }
      }

      // 政策条目样式 - 二级缩进显示
      .policy-node {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 12px 16px 12px 50px; // 增加左侧缩进
        margin: 6px 0;
        background: #ecf5ff;
        border: 1px solid #b3d8ff;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-sizing: border-box;

        &:hover {
          box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
          filter: brightness(0.98);
        }

        .policy-icon {
          font-size: 16px;
          margin-right: 10px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #409eff;
          color: #fff;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .node-label {
          font-size: 14px;
          font-weight: 600;
          color: #303133;
          flex-shrink: 0;
          margin-right: 12px;
          white-space: nowrap;
        }

        .node-desc {
          font-size: 12px;
          color: #909399;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .node-actions {
          margin-left: 12px;
          padding-left: 12px;
          border-left: 1px solid #e4e7ed;
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          align-items: center;

          // 增大操作按钮字号
          ::v-deep .el-button {
            font-size: 14px;
            padding: 6px 12px;
          }

          .delete-btn {
            color: #f56c6c;
            &:hover {
              color: #f56c6c;
            }
          }
        }
      }
    }

    // 展开箭头样式覆盖
    :deep(.el-tree-node__expand-icon) {
      margin-right: 6px;
      font-size: 14px;
    }

    :deep(.el-tree-node__expand-icon.is-leaf) {
      color: transparent;
      width: 14px;
    }
  }
}

.policy-detail-dialog {
  .el-message-box__message {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.8;
  }
}
</style>
