<template>
  <div class="health-centers-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">卫生服务中心</span>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="header-button"
          @click="showAddDialog"
        >
          新增中心
        </el-button>
      </div>

      <!-- 表格 -->
      <div class="table-wrapper">
        <el-table v-loading="loading" :data="centerList" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="name" label="服务中心名称" width="180" align="center" />
          <el-table-column prop="serviceType" label="服务类型" width="120" align="center">
            <template slot-scope="scope">
              <el-tag :type="getServiceTypeTag(scope.row.serviceType)" size="small">
                {{ scope.row.serviceType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" min-width="200" />
          <el-table-column prop="director" label="负责人" width="100" align="center" />
          <el-table-column prop="contactPhone" label="联系电话" width="130" align="center" />
          <el-table-column prop="businessHours" label="营业时间" width="160" align="center" />
          <el-table-column prop="status" label="服务状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '正常营业' ? 'success' : 'warning'" size="small">
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
            <el-form-item label="服务中心名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入服务中心名称" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务类型" prop="serviceType">
              <el-select v-model="form.serviceType" placeholder="请选择服务类型" style="width: 100%">
                <el-option label="社区医疗服务中心" value="社区医疗服务中心" />
                <el-option label="社区卫生服务站" value="社区卫生服务站" />
                <el-option label="康复理疗中心" value="康复理疗中心" />
                <el-option label="中医馆" value="中医馆" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="服务地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入服务地址" maxlength="200" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" prop="director">
              <el-input v-model="form.director" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" maxlength="15" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="营业时间" prop="businessHours">
          <el-input v-model="form.businessHours" placeholder="例如：周一至周日 8:00-18:00" maxlength="50" />
        </el-form-item>

        <el-form-item label="服务范围" prop="services">
          <el-input
            v-model="form.services"
            type="textarea"
            :rows="3"
            placeholder="请输入服务范围，如：全科医疗、预防保健、康复护理等"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="设施配置" prop="facilities">
          <el-checkbox-group v-model="form.facilities">
            <el-checkbox label="诊疗室" name="facilities" />
            <el-checkbox label="药房" name="facilities" />
            <el-checkbox label="输液室" name="facilities" />
            <el-checkbox label="理疗室" name="facilities" />
            <el-checkbox label="检验室" name="facilities" />
            <el-checkbox label="康复训练室" name="facilities" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入服务中心简介"
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
      title="服务中心详情"
      :visible.sync="detailVisible"
      width="650px"
      append-to-body
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="服务中心名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="服务类型">{{ detailData.serviceType }}</el-descriptions-item>
        <el-descriptions-item label="服务地址" :span="2">{{ detailData.address }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ detailData.director }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailData.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="营业时间">{{ detailData.businessHours }}</el-descriptions-item>
        <el-descriptions-item label="服务状态">
          <el-tag :type="detailData.status === '正常营业' ? 'success' : 'warning'" size="small">
            {{ detailData.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="服务范围" :span="2">{{ detailData.services }}</el-descriptions-item>
        <el-descriptions-item label="设施配置" :span="2">
          <el-tag v-for="(item, index) in detailData.facilities" :key="index" size="small" style="margin-right: 8px">
            {{ item }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="简介" :span="2">{{ detailData.description }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'HealthCenters',
  data() {
    return {
      loading: false,
      submitLoading: false,
      centerList: [
        {
          id: 1,
          name: '阳光社区医疗服务中心',
          serviceType: '社区医疗服务中心',
          address: '北京市朝阳区阳光大街66号',
          director: '张主任',
          contactPhone: '010-11112222',
          businessHours: '周一至周日 8:00-20:00',
          status: '正常营业',
          services: '全科医疗、预防保健、慢性病管理、健康咨询',
          facilities: ['诊疗室', '药房', '输液室', '检验室'],
          description: '综合性社区医疗服务中心，为居民提供全方位的医疗卫生服务'
        },
        {
          id: 2,
          name: '幸福社区卫生服务站',
          serviceType: '社区卫生服务站',
          address: '北京市海淀区幸福路168号',
          director: '李站长',
          contactPhone: '010-33334444',
          businessHours: '周一至周六 9:00-18:00',
          status: '正常营业',
          services: '基本医疗、公共卫生、家庭医生签约',
          facilities: ['诊疗室', '药房'],
          description: '提供基础医疗服务和公共卫生服务'
        }
      ],
      dialogVisible: false,
      dialogTitle: '新增服务中心',
      detailVisible: false,
      form: {
        id: null,
        name: '',
        serviceType: '',
        address: '',
        director: '',
        contactPhone: '',
        businessHours: '',
        services: '',
        facilities: [],
        status: '正常营业',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入服务中心名称', trigger: 'blur' },
          { min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'blur' }
        ],
        serviceType: [
          { required: true, message: '请选择服务类型', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入服务地址', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ],
        director: [
          { required: true, message: '请输入负责人', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        businessHours: [
          { required: true, message: '请输入营业时间', trigger: 'blur' },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ],
        services: [
          { required: true, message: '请输入服务范围', trigger: 'blur' },
          { min: 10, max: 300, message: '长度在 10 到 300 个字符', trigger: 'blur' }
        ]
      },
      detailData: {}
    }
  },
  methods: {
    getServiceTypeTag(type) {
      const typeMap = {
        '社区医疗服务中心': 'primary',
        '社区卫生服务站': 'success',
        '康复理疗中心': 'warning',
        '中医馆': 'info'
      }
      return typeMap[type] || 'info'
    },

    showAddDialog() {
      this.dialogTitle = '新增服务中心'
      this.resetForm()
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    handleEdit(row) {
      this.dialogTitle = '编辑服务中心'
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
        serviceType: '',
        address: '',
        director: '',
        contactPhone: '',
        businessHours: '',
        services: '',
        facilities: [],
        status: '正常营业',
        description: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.health-centers-container {
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

  :deep(.el-checkbox-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .el-checkbox {
      margin-right: 0;
    }
  }
}
</style>
