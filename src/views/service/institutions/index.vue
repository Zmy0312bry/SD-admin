<template>
  <div class="institutions-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">养老机构清单</span>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="header-button"
          @click="showAddDialog"
        >
          新增机构
        </el-button>
      </div>

      <!-- 表格 -->
      <div class="table-wrapper">
        <el-table v-loading="loading" :data="institutionList" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="name" label="机构名称" width="180" align="center" />
          <el-table-column prop="type" label="机构类型" width="120" align="center">
            <template slot-scope="scope">
              <el-tag :type="getTypeTagType(scope.row.type)" size="small">
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" min-width="200" />
          <el-table-column prop="contactPerson" label="联系人" width="100" align="center" />
          <el-table-column prop="contactPhone" label="联系电话" width="130" align="center" />
          <el-table-column prop="capacity" label="床位数量" width="100" align="center" />
          <el-table-column prop="status" label="运营状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '运营中' ? 'success' : 'info'" size="small">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="small" type="text" icon="el-icon-view" @click="viewDetail(scope.row)">
                查看
              </el-button>
              <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button
                size="small"
                type="text"
                icon="el-icon-delete"
                class="delete-btn"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="机构名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入机构名称" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择机构类型" style="width: 100%">
                <el-option label="养老院" value="养老院" />
                <el-option label="日间照料中心" value="日间照料中心" />
                <el-option label="社区养老服务站" value="社区养老服务站" />
                <el-option label="居家养老服务中心" value="居家养老服务中心" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="机构地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入机构地址" maxlength="200" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" maxlength="15" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="床位数量" prop="capacity">
              <el-input-number v-model="form.capacity" :min="0" :max="500" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运营状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择运营状态" style="width: 100%">
                <el-option label="运营中" value="运营中" />
                <el-option label="筹备中" value="筹备中" />
                <el-option label="已停业" value="已停业" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="服务内容" prop="services">
          <el-input
            v-model="form.services"
            type="textarea"
            :rows="4"
            placeholder="请输入服务内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="机构简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入机构简介"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      title="机构详情"
      :visible.sync="detailVisible"
      width="600px"
      append-to-body
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="机构名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="机构类型">{{ detailData.type }}</el-descriptions-item>
        <el-descriptions-item label="机构地址" :span="2">{{ detailData.address }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ detailData.contactPerson }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailData.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="床位数量">{{ detailData.capacity }} 张</el-descriptions-item>
        <el-descriptions-item label="运营状态">
          <el-tag :type="detailData.status === '运营中' ? 'success' : 'info'" size="small">
            {{ detailData.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="服务内容" :span="2">
          {{ detailData.services }}
        </el-descriptions-item>
        <el-descriptions-item label="机构简介" :span="2">
          {{ detailData.description }}
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Institutions',
  data() {
    return {
      loading: false,
      submitLoading: false,
      institutionList: [
        {
          id: 1,
          name: '阳光养老院',
          type: '养老院',
          address: '北京市朝阳区太阳宫中路2号',
          contactPerson: '王院长',
          contactPhone: '010-12345678',
          capacity: 200,
          status: '运营中',
          services: '提供生活照料、康复护理、文娱活动等服务',
          description: '专业养老机构，环境优美，服务周到'
        },
        {
          id: 2,
          name: '幸福社区日间照料中心',
          type: '日间照料中心',
          address: '北京市海淀区中关村大街88号',
          contactPerson: '李主任',
          contactPhone: '010-87654321',
          capacity: 50,
          status: '运营中',
          services: '日间照料、助餐服务、健康监测',
          description: '为社区老人提供日间照料和休闲娱乐服务'
        }
      ],
      dialogVisible: false,
      dialogTitle: '新增机构',
      detailVisible: false,
      form: {
        id: null,
        name: '',
        type: '',
        address: '',
        contactPerson: '',
        contactPhone: '',
        capacity: 0,
        status: '运营中',
        services: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择机构类型', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入机构地址', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ],
        contactPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '请输入床位数量', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择运营状态', trigger: 'change' }
        ]
      },
      detailData: {}
    }
  },
  methods: {
    getTypeTagType(type) {
      const typeMap = {
        '养老院': 'primary',
        '日间照料中心': 'success',
        '社区养老服务站': 'warning',
        '居家养老服务中心': 'info'
      }
      return typeMap[type] || 'info'
    },

    showAddDialog() {
      this.dialogTitle = '新增机构'
      this.resetForm()
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    handleEdit(row) {
      this.dialogTitle = '编辑机构'
      this.form = { ...row }
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    viewDetail(row) {
      this.detailData = { ...row }
      this.detailVisible = true
    },

    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          setTimeout(() => {
            this.$message.success(this.form.id ? '编辑成功' : '新增成功')
            this.dialogVisible = false
            this.submitLoading = false
          }, 500)
        }
      })
    },

    handleDelete(row) {
      this.$confirm(`确定要删除"${row.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      }).catch(() => {})
    },

    resetForm() {
      this.form = {
        id: null,
        name: '',
        type: '',
        address: '',
        contactPerson: '',
        contactPhone: '',
        capacity: 0,
        status: '运营中',
        services: '',
        description: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.institutions-container {
  padding: 24px;
  min-height: 600px;

  .box-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .header-button {
      font-weight: 500;
    }
  }

  .table-wrapper {
    margin-top: 20px;
    padding: 20px;
    background: #fafafa;
    border-radius: 6px;

    :deep(.el-table) {
      font-size: 14px;

      th {
        background-color: #f5f7fa;
        font-weight: 600;
        color: #606266;
        padding: 16px 0;
      }

      td {
        padding: 14px 0;
      }

      .cell {
        padding: 0 12px;
      }
    }

    :deep(.el-button--small) {
      padding: 6px 12px;
      font-size: 12px;
      margin-right: 4px;
    }

    .delete-btn {
      color: #f56c6c;

      &:hover {
        color: #f56c6c;
      }
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.el-textarea__inner) {
    resize: none;
  }
}
</style>
