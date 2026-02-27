<template>
  <div class="community-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">社区信息管理</span>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="float: right"
          @click="goToAddPage"
        >新增信息</el-button>
      </div>

      <el-table :data="communityList" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="社区名称" width="200" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="serviceHours" label="服务时间" width="180" />
        <el-table-column prop="features" label="服务特色" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Community',
  data() {
    return {
      communityList: [
        {
          id: 1,
          name: '幸福家园社区',
          address: '北京市朝阳区幸福大街100号',
          phone: '010-12345678',
          serviceHours: '周一至周日 9:00-18:00',
          features: '医疗服务、文化娱乐、日间照料'
        },
        {
          id: 2,
          name: '阳光花园社区',
          address: '北京市海淀区花园路88号',
          phone: '010-87654321',
          serviceHours: '周一至周六 8:30-17:30',
          features: '康复护理、助餐服务、文娱活动'
        }
      ]
    }
  },
  methods: {
    goToAddPage() {
      this.$router.push('/encyclopedia/community/add')
    },
    handleView(row) {
      this.$alert(
        `社区名称: ${row.name}\n地址: ${row.address}\n联系电话: ${row.phone}\n服务时间: ${row.serviceHours}\n服务特色: ${row.features}`,
        '社区详情',
        {
          confirmButtonText: '关闭'
        }
      )
    },
    handleEdit(row) {
      this.$message.info('编辑功能待实现')
    },
    handleDelete(row) {
      this.$confirm(`确定要删除"${row.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const index = this.communityList.findIndex(
            (item) => item.id === row.id
          )
          if (index !== -1) {
            this.communityList.splice(index, 1)
            this.$message.success('删除成功')
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.community-container {
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
</style>
