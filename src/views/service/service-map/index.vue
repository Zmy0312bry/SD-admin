<template>
  <div class="service-map-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">养老服务地图</span>
        <div class="header-actions">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="showAddCommunityDialog"
          >
            新增社区
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            size="small"
            @click="refreshData"
          >
            刷新
          </el-button>
        </div>
      </div>

      <div class="tree-wrapper">
        <el-tree
          ref="serviceTree"
          :data="serviceTree"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          node-key="id"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <!-- 一级：社区 -->
            <div v-if="data.level === 1" class="community-node">
              <i class="el-icon-s-home community-icon" />
              <span class="node-label">{{ node.label }}</span>
              <span class="node-info">{{ data.address }}</span>
              <span class="node-actions">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-plus"
                  @click="showAddTypeDialog(data)"
                >
                  添加服务类型
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editCommunity(data)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click="removeCommunity(node, data)"
                >
                  删除
                </el-button>
              </span>
            </div>

            <!-- 二级：服务类型 -->
            <div v-else-if="data.level === 2" class="service-type-node">
              <i class="el-icon-s-operation service-type-icon" />
              <span class="node-label">{{ node.label }}</span>
              <span class="node-desc">{{ data.description }}</span>
              <span class="node-actions">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-plus"
                  @click="showAddShopDialog(data)"
                >
                  添加店铺
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click="removeServiceType(node, data)"
                >
                  删除
                </el-button>
              </span>
            </div>

            <!-- 三级：具体店铺 -->
            <div v-else-if="data.level === 3" class="shop-node">
              <i class="el-icon-s-shop shop-icon" />
              <span class="node-label">{{ node.label }}</span>
              <span class="node-desc">{{ data.address }}</span>
              <span class="node-contact">{{ data.contactPhone }}</span>
              <span class="node-actions">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-view"
                  @click="viewShop(data)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editShop(data)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click="removeShop(node, data)"
                >
                  删除
                </el-button>
              </span>
            </div>
          </span>
        </el-tree>
      </div>
    </el-card>

    <!-- 新增社区对话框 -->
    <el-dialog
      title="新增社区"
      :visible.sync="addCommunityDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="communityForm"
        :model="communityForm"
        :rules="communityRules"
        label-width="100px"
      >
        <el-form-item label="社区名称" prop="name">
          <el-input
            v-model="communityForm.name"
            placeholder="请输入社区名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="社区地址" prop="address">
          <el-input
            v-model="communityForm.address"
            placeholder="请输入社区地址"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="社区简介" prop="description">
          <el-input
            v-model="communityForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入社区简介"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCommunityDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCommunity">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增服务类型对话框 -->
    <el-dialog
      title="新增服务类型"
      :visible.sync="addTypeDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="typeForm"
        :model="typeForm"
        :rules="typeRules"
        label-width="100px"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input
            v-model="typeForm.name"
            placeholder="请输入类型名称"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="类型描述" prop="description">
          <el-input
            v-model="typeForm.description"
            type="textarea"
            :rows="2"
            placeholder="请输入类型描述"
            maxlength="100"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddType">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增店铺对话框 -->
    <el-dialog
      title="新增服务店铺"
      :visible.sync="addShopDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="shopForm"
        :model="shopForm"
        :rules="shopRules"
        label-width="100px"
      >
        <el-form-item label="店铺名称" prop="name">
          <el-input
            v-model="shopForm.name"
            placeholder="请输入店铺名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="店铺地址" prop="address">
          <el-input
            v-model="shopForm.address"
            placeholder="请输入店铺地址"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input
            v-model="shopForm.contactPhone"
            placeholder="请输入联系电话"
            maxlength="15"
          />
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-input
            v-model="shopForm.businessHours"
            placeholder="例如：周一至周日 9:00-21:00"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="服务内容" prop="services">
          <el-input
            v-model="shopForm.services"
            type="textarea"
            :rows="3"
            placeholder="请输入服务内容"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShopDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddShop">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 店铺详情对话框 -->
    <el-dialog
      title="店铺详情"
      :visible.sync="shopDetailVisible"
      width="600px"
      append-to-body
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="店铺名称">{{
          shopDetailData.name
        }}</el-descriptions-item>
        <el-descriptions-item label="所属社区">{{
          shopDetailData.communityName
        }}</el-descriptions-item>
        <el-descriptions-item label="服务类型">{{
          shopDetailData.serviceType
        }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          shopDetailData.contactPhone
        }}</el-descriptions-item>
        <el-descriptions-item label="店铺地址" :span="2">{{
          shopDetailData.address
        }}</el-descriptions-item>
        <el-descriptions-item label="营业时间">{{
          shopDetailData.businessHours
        }}</el-descriptions-item>
        <el-descriptions-item label="服务内容" :span="2">{{
          shopDetailData.services
        }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="shopDetailVisible = false"
        >关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ServiceMap',
  data() {
    return {
      serviceTree: [
        {
          id: 1,
          label: '幸福社区',
          level: 1,
          address: '北京市朝阳区幸福大街100号',
          children: [
            {
              id: 11,
              label: '餐饮服务',
              level: 2,
              description: '为老人提供营养餐和特色餐饮服务',
              children: [
                {
                  id: 111,
                  label: '幸福社区食堂',
                  level: 3,
                  address: '幸福社区1号楼底商',
                  contactPhone: '010-12345678',
                  businessHours: '周一至周日 6:30-20:00',
                  services: '早餐、午餐、晚餐、送餐服务',
                  communityName: '幸福社区',
                  serviceType: '餐饮服务'
                },
                {
                  id: 112,
                  label: '特色小吃店',
                  level: 3,
                  address: '幸福社区2号楼底商',
                  contactPhone: '010-12345679',
                  businessHours: '周一至周日 8:00-22:00',
                  services: '包子、饺子、面食等传统小吃',
                  communityName: '幸福社区',
                  serviceType: '餐饮服务'
                }
              ]
            },
            {
              id: 12,
              label: '生活服务',
              level: 2,
              description: '提供日常生活所需的各项服务',
              children: [
                {
                  id: 121,
                  label: '社区便利店',
                  level: 3,
                  address: '幸福社区3号楼底商',
                  contactPhone: '010-12345677',
                  businessHours: '周一至周日 7:00-23:00',
                  services: '日用品销售、代缴水电费、快递代收',
                  communityName: '幸福社区',
                  serviceType: '生活服务'
                },
                {
                  id: 122,
                  label: '理发店',
                  level: 3,
                  address: '幸福社区4号楼底商',
                  contactPhone: '010-12345676',
                  businessHours: '周一至周日 9:00-18:00',
                  services: '理发、烫发、染发、剪发',
                  communityName: '幸福社区',
                  serviceType: '生活服务'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '阳光社区',
          level: 1,
          address: '北京市海淀区阳光路88号',
          children: [
            {
              id: 21,
              label: '医疗健康服务',
              level: 2,
              description: '提供基础医疗和健康咨询等服务',
              children: [
                {
                  id: 211,
                  label: '社区药房',
                  level: 3,
                  address: '阳光社区1号楼底商',
                  contactPhone: '010-87654321',
                  businessHours: '周一至周日 8:00-21:00',
                  services: '处方药销售、健康咨询、测血压',
                  communityName: '阳光社区',
                  serviceType: '医疗健康服务'
                },
                {
                  id: 212,
                  label: '中医理疗馆',
                  level: 3,
                  address: '阳光社区2号楼底商',
                  contactPhone: '010-87654322',
                  businessHours: '周一至周日 9:00-20:00',
                  services: '推拿按摩、拔罐、针灸、艾灸',
                  communityName: '阳光社区',
                  serviceType: '医疗健康服务'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      addCommunityDialogVisible: false,
      addTypeDialogVisible: false,
      addShopDialogVisible: false,
      shopDetailVisible: false,
      communityForm: {
        name: '',
        address: '',
        description: ''
      },
      typeForm: {
        name: '',
        description: ''
      },
      shopForm: {
        name: '',
        address: '',
        contactPhone: '',
        businessHours: '',
        services: '',
        communityId: null,
        typeId: null,
        communityName: '',
        serviceType: ''
      },
      communityRules: {
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
        ]
      },
      typeRules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
        ]
      },
      shopRules: {
        name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ],
        address: [
          { required: true, message: '请输入店铺地址', trigger: 'blur' },
          {
            min: 5,
            max: 200,
            message: '长度在 5 到 200 个字符',
            trigger: 'blur'
          }
        ],
        contactPhone: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      shopDetailData: {}
    }
  },
  methods: {
    showAddCommunityDialog() {
      this.communityForm = { name: '', address: '', description: '' }
      this.addCommunityDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.communityForm) {
          this.$refs.communityForm.clearValidate()
        }
      })
    },

    handleAddCommunity() {
      this.$refs.communityForm.validate((valid) => {
        if (valid) {
          const newId =
            Math.max(...this.serviceTree.map((item) => item.id), 0) + 1
          const newCommunity = {
            id: newId,
            label: this.communityForm.name,
            level: 1,
            address: this.communityForm.address,
            children: []
          }
          this.serviceTree.push(newCommunity)
          this.$message.success('社区添加成功')
          this.addCommunityDialogVisible = false
        }
      })
    },

    editCommunity(data) {
      this.$message.info('编辑社区功能待实现')
    },

    removeCommunity(node, data) {
      this.$confirm(`确定要删除社区"${data.label}"及其所有服务吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const index = this.serviceTree.findIndex(
            (item) => item.id === data.id
          )
          if (index !== -1) {
            this.serviceTree.splice(index, 1)
            this.$message.success('社区删除成功')
          }
        })
        .catch(() => {})
    },

    showAddTypeDialog(community) {
      this.typeForm = { name: '', description: '' }
      this.typeForm.communityId = community.id
      this.typeForm.communityName = community.label
      this.addTypeDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.typeForm) {
          this.$refs.typeForm.clearValidate()
        }
      })
    },

    handleAddType() {
      this.$refs.typeForm.validate((valid) => {
        if (valid) {
          const community = this.serviceTree.find(
            (item) => item.id === this.typeForm.communityId
          )
          if (community) {
            const newId =
              Math.max(
                ...this.serviceTree.flatMap((item) =>
                  item.children.map((child) => child.id)
                ),
                0
              ) + 1
            const newType = {
              id: newId,
              label: this.typeForm.name,
              level: 2,
              description: this.typeForm.description,
              children: []
            }
            community.children.push(newType)
            this.$message.success('服务类型添加成功')
            this.addTypeDialogVisible = false
          }
        }
      })
    },

    removeServiceType(node, data) {
      this.$confirm(
        `确定要删除服务类型"${data.label}"及其所有店铺吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const parent = node.parent
          const index = parent.data.children.findIndex(
            (item) => item.id === data.id
          )
          if (index !== -1) {
            parent.data.children.splice(index, 1)
            this.$message.success('服务类型删除成功')
          }
        })
        .catch(() => {})
    },

    showAddShopDialog(serviceType) {
      this.shopForm = {
        name: '',
        address: '',
        contactPhone: '',
        businessHours: '',
        services: '',
        typeId: serviceType.id,
        serviceType: serviceType.label,
        communityName: serviceType.node.parent.data.label
      }
      this.addShopDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.shopForm) {
          this.$refs.shopForm.clearValidate()
        }
      })
    },

    handleAddShop() {
      this.$refs.shopForm.validate((valid) => {
        if (valid) {
          const parent = this.$refs.serviceTree.getNode(this.shopForm.typeId)
            .parent.data
          const serviceType = parent.children.find(
            (item) => item.id === this.shopForm.typeId
          )
          if (serviceType) {
            const newId =
              Math.max(
                ...this.serviceTree.flatMap(
                  (item) =>
                    item.children.flatMap((child) =>
                      child.children.map((shop) => shop.id)
                    ),
                  0
                )
              ) + 1
            const newShop = {
              id: newId,
              label: this.shopForm.name,
              level: 3,
              address: this.shopForm.address,
              contactPhone: this.shopForm.contactPhone,
              businessHours: this.shopForm.businessHours,
              services: this.shopForm.services,
              communityName: this.shopForm.communityName,
              serviceType: this.shopForm.serviceType
            }
            serviceType.children.push(newShop)
            this.$message.success('店铺添加成功')
            this.addShopDialogVisible = false
          }
        }
      })
    },

    editShop(data) {
      this.$message.info('编辑店铺功能待实现')
    },

    viewShop(data) {
      this.shopDetailData = { ...data }
      this.shopDetailVisible = true
    },

    removeShop(node, data) {
      this.$confirm(`确定要删除店铺"${data.label}"吗？`, '提示', {
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
            this.$message.success('店铺删除成功')
          }
        })
        .catch(() => {})
    },

    refreshData() {
      this.$message.success('数据已刷新')
    }
  }
}
</script>

<style lang="scss" scoped>
.service-map-container {
  padding: 24px;
  min-height: 700px;

  .box-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .tree-wrapper {
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

      // 一级：社区节点样式 - 突出显示
      .community-node {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 14px 18px;
        margin: 8px 0;
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

        .community-icon {
          font-size: 20px;
          margin-right: 12px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #409eff;
          color: #fff;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .node-label {
          font-size: 16px;
          font-weight: 700;
          color: #409eff;
          flex-shrink: 0;
          margin-right: 12px;
          white-space: nowrap;
        }

        .node-info {
          font-size: 13px;
          color: #909399;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .node-actions {
          margin-left: auto;
          padding-left: 12px;
          border-left: 1px solid rgba(64, 158, 255, 0.3);
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

      // 二级：服务类型节点样式 - 增加缩进
      .service-type-node {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 12px 16px 12px 50px;
        margin: 6px 0;
        background: #f0f9eb;
        border: 1px solid #c2e7b0;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-sizing: border-box;

        &:hover {
          box-shadow: 0 2px 12px rgba(103, 194, 58, 0.2);
          filter: brightness(0.98);
        }

        .service-type-icon {
          font-size: 17px;
          margin-right: 10px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #67c23a;
          color: #fff;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .node-label {
          font-size: 15px;
          font-weight: 600;
          color: #67c23a;
          flex-shrink: 0;
          margin-right: 12px;
          white-space: nowrap;
        }

        .node-desc {
          font-size: 13px;
          color: #909399;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .node-actions {
          margin-left: auto;
          padding-left: 12px;
          border-left: 1px solid rgba(103, 194, 58, 0.3);
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

      // 三级：店铺节点样式 - 最大缩进
      .shop-node {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 12px 16px 12px 84px;
        margin: 6px 0;
        background: #f4f4f5;
        border: 1px solid #d3d4d6;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-sizing: border-box;

        &:hover {
          box-shadow: 0 2px 12px rgba(144, 147, 153, 0.2);
          filter: brightness(0.98);
        }

        .shop-icon {
          font-size: 16px;
          margin-right: 10px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #909399;
          color: #fff;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .node-label {
          font-size: 14px;
          font-weight: 500;
          color: #606266;
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

        .node-contact {
          font-size: 12px;
          color: #67c23a;
          margin-left: 12px;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .node-actions {
          margin-left: auto;
          padding-left: 12px;
          border-left: 1px solid rgba(144, 147, 153, 0.3);
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
</style>
