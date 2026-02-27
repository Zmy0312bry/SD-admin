<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">新增社区信息</span>
        <el-button
          type="text"
          icon="el-icon-arrow-left"
          style="float: right"
          @click="goBack"
        >
          返回列表
        </el-button>
      </div>

      <div class="form-wrapper">
        <el-form
          ref="communityForm"
          :model="form"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="社区名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入社区名称"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="社区地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入社区详细地址"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入联系电话"
              maxlength="20"
            />
          </el-form-item>

          <el-form-item label="服务时间" prop="serviceHours">
            <el-input
              v-model="form.serviceHours"
              placeholder="例如：周一至周日 9:00-18:00"
              maxlength="50"
            />
          </el-form-item>

          <el-form-item label="服务特色" prop="features">
            <el-input
              v-model="form.features"
              type="textarea"
              :rows="3"
              placeholder="请输入社区服务特色，多个特色用逗号分隔"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="社区简介" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入社区简介"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="服务人数" prop="capacity">
            <el-input-number
              v-model="form.capacity"
              :min="0"
              :max="10000"
              label="人"
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="占地面积" prop="area">
            <el-input
              v-model="form.area"
              placeholder="请输入占地面积"
              maxlength="20"
              style="width: 300px"
            >
              <template slot="append">平方米</template>
            </el-input>
          </el-form-item>

          <el-form-item label="建立时间" prop="establishDate">
            <el-date-picker
              v-model="form.establishDate"
              type="date"
              placeholder="选择建立时间"
              style="width: 300px"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item label="服务状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio label="正常">正常运营</el-radio>
              <el-radio label="维护">维护中</el-radio>
              <el-radio label="停业">已停业</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="提供养老餐" prop="provideMeal">
            <el-switch v-model="form.provideMeal" />
          </el-form-item>

          <el-form-item label="是否24小时" prop="is24Hours">
            <el-switch v-model="form.is24Hours" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
            <el-button @click="goBack">取 消</el-button>
            <el-button @click="handleReset">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CommunityAdd',
  data() {
    return {
      form: {
        name: '',
        address: '',
        phone: '',
        serviceHours: '',
        features: '',
        description: '',
        capacity: 0,
        area: '',
        establishDate: '',
        status: '正常',
        provideMeal: false,
        is24Hours: false
      },
      rules: {
        name: [
          { required: true, message: '请输入社区名称', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ],
        address: [
          { required: true, message: '请输入社区地址', trigger: 'blur' },
          {
            min: 5,
            max: 200,
            message: '长度在 5 到 200 个字符',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        serviceHours: [
          { required: true, message: '请输入服务时间', trigger: 'blur' },
          {
            min: 5,
            max: 50,
            message: '长度在 5 到 50 个字符',
            trigger: 'blur'
          }
        ],
        features: [
          { required: true, message: '请输入服务特色', trigger: 'blur' },
          {
            min: 5,
            max: 200,
            message: '长度在 5 到 200 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.communityForm.validate((valid) => {
        if (valid) {
          this.$message.success('社区信息添加成功')
          setTimeout(() => {
            this.goBack()
          }, 1000)
        }
      })
    },
    goBack() {
      this.$router.push('/encyclopedia/community')
    },
    handleReset() {
      this.$refs.communityForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
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

    .form-wrapper {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;

      .el-form-item {
        margin-bottom: 28px;
      }

      .el-input,
      .el-textarea,
      .el-select,
      .el-date-picker {
        width: 100%;
      }
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
  }

  :deep(.el-input__inner),
  :deep(.el-textarea__inner) {
    border-radius: 4px;
  }

  :deep(.el-button) {
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 4px;
  }
}
</style>
