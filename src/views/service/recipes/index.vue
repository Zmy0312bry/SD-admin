<template>
  <div class="recipes-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">养老食谱管理</span>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="header-button"
          @click="showAddCanteenDialog"
        >
          新增食堂
        </el-button>
      </div>

      <div class="recipes-wrapper">
        <!-- 左侧食堂列表 -->
        <div class="canteen-sidebar">
          <div class="canteen-list">
            <div
              v-for="canteen in canteenList"
              :key="canteen.id"
              :class="[
                'canteen-item',
                { active: currentCanteenId === canteen.id },
              ]"
              @click="selectCanteen(canteen)"
            >
              <div class="canteen-icon">
                <i class="el-icon-s-home" />
              </div>
              <div class="canteen-info">
                <div class="canteen-name">{{ canteen.name }}</div>
                <div class="canteen-address">{{ canteen.address }}</div>
              </div>
              <div class="canteen-actions">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click.stop="editCanteen(canteen)"
                />
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click.stop="deleteCanteen(canteen)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧菜谱表格 -->
        <div class="menu-content">
          <div v-if="currentCanteen" class="canteen-header">
            <h3 class="canteen-title">{{ currentCanteen.name }}</h3>
            <p class="canteen-desc">{{ currentCanteen.description }}</p>
          </div>

          <el-empty v-else description="请选择左侧食堂查看食谱" />

          <div v-if="currentCanteen" class="menu-table-wrapper">
            <el-table
              :data="menuData"
              border
              style="width: 100%"
              class="menu-table"
            >
              <el-table-column
                prop="meal"
                label="餐别"
                width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag :type="getMealTagType(scope.row.meal)" size="medium">
                    {{ scope.row.meal }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="monday" label="周一" min-width="150">
                <template slot-scope="scope">
                  <div
                    class="menu-cell"
                    @click="editMenu('周一', scope.row.meal)"
                  >
                    {{ scope.row.monday || "点击编辑" }}
                    <i class="el-icon-edit edit-icon" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="tuesday" label="周二" min-width="150">
                <template slot-scope="scope">
                  <div
                    class="menu-cell"
                    @click="editMenu('周二', scope.row.meal)"
                  >
                    {{ scope.row.tuesday || "点击编辑" }}
                    <i class="el-icon-edit edit-icon" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="wednesday" label="周三" min-width="150">
                <template slot-scope="scope">
                  <div
                    class="menu-cell"
                    @click="editMenu('周三', scope.row.meal)"
                  >
                    {{ scope.row.wednesday || "点击编辑" }}
                    <i class="el-icon-edit edit-icon" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="thursday" label="周四" min-width="150">
                <template slot-scope="scope">
                  <div
                    class="menu-cell"
                    @click="editMenu('周四', scope.row.meal)"
                  >
                    {{ scope.row.thursday || "点击编辑" }}
                    <i class="el-icon-edit edit-icon" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="friday" label="周五" min-width="150">
                <template slot-scope="scope">
                  <div
                    class="menu-cell"
                    @click="editMenu('周五', scope.row.meal)"
                  >
                    {{ scope.row.friday || "点击编辑" }}
                    <i class="el-icon-edit edit-icon" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="saturday" label="周六" min-width="150">
                <template slot-scope="scope">
                  <div
                    class="menu-cell"
                    @click="editMenu('周六', scope.row.meal)"
                  >
                    {{ scope.row.saturday || "点击编辑" }}
                    <i class="el-icon-edit edit-icon" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="sunday" label="周日" min-width="150">
                <template slot-scope="scope">
                  <div
                    class="menu-cell"
                    @click="editMenu('周日', scope.row.meal)"
                  >
                    {{ scope.row.sunday || "点击编辑" }}
                    <i class="el-icon-edit edit-icon" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 新增/编辑食堂对话框 -->
    <el-dialog
      :title="canteenDialogTitle"
      :visible.sync="canteenDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="canteenForm"
        :model="canteenForm"
        :rules="canteenRules"
        label-width="120px"
      >
        <el-form-item label="食堂名称" prop="name">
          <el-input
            v-model="canteenForm.name"
            placeholder="请输入食堂名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="所属社区" prop="community">
          <el-input
            v-model="canteenForm.community"
            placeholder="请输入所属社区"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="食堂地址" prop="address">
          <el-input
            v-model="canteenForm.address"
            placeholder="请输入食堂地址"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input
            v-model="canteenForm.manager"
            placeholder="请输入负责人"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="canteenForm.phone"
            placeholder="请输入联系电话"
            maxlength="15"
          />
        </el-form-item>
        <el-form-item label="座位数量" prop="seats">
          <el-input-number
            v-model="canteenForm.seats"
            :min="0"
            :max="500"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-input
            v-model="canteenForm.businessHours"
            placeholder="例如：周一至周日 7:00-20:00"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="食堂简介" prop="description">
          <el-input
            v-model="canteenForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入食堂简介"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canteenDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="canteenLoading"
          @click="handleCanteenSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑菜谱对话框 -->
    <el-dialog
      :title="menuDialogTitle"
      :visible.sync="menuDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="menuForm"
        :model="menuForm"
        :rules="menuRules"
        label-width="100px"
      >
        <el-form-item label="周几" prop="day">
          <el-input v-model="menuForm.day" disabled />
        </el-form-item>
        <el-form-item label="餐别" prop="meal">
          <el-input v-model="menuForm.meal" disabled />
        </el-form-item>
        <el-form-item label="菜品" prop="dish">
          <el-input
            v-model="menuForm.dish"
            type="textarea"
            :rows="4"
            placeholder="请输入菜品，如：红烧肉、清炒时蔬、紫菜蛋花汤"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="营养备注" prop="nutrition">
          <el-input
            v-model="menuForm.nutrition"
            type="textarea"
            :rows="2"
            placeholder="请输入营养备注"
            maxlength="100"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMenuSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Recipes',
  data() {
    return {
      canteenList: [
        {
          id: 1,
          name: '幸福社区养老食堂',
          community: '幸福社区',
          address: '北京市朝阳区幸福大街100号',
          manager: '张师傅',
          phone: '010-12345678',
          seats: 80,
          businessHours: '周一至周日 7:00-20:00',
          description: '为社区老人提供营养均衡的餐食服务'
        },
        {
          id: 2,
          name: '阳光花园老年食堂',
          community: '阳光社区',
          address: '北京市海淀区花园路88号',
          manager: '李师傅',
          phone: '010-87654321',
          seats: 120,
          businessHours: '周一至周六 7:30-19:00',
          description: '专业老年餐饮服务，注重营养搭配'
        }
      ],
      currentCanteenId: 1,
      canteenDialogVisible: false,
      canteenDialogTitle: '新增食堂',
      canteenLoading: false,
      canteenForm: {
        id: null,
        name: '',
        community: '',
        address: '',
        manager: '',
        phone: '',
        seats: 0,
        businessHours: '',
        description: ''
      },
      menuData: [],
      menuDialogVisible: false,
      menuDialogTitle: '编辑菜谱',
      menuForm: {
        day: '',
        meal: '',
        dish: '',
        nutrition: ''
      },
      menuRules: {
        dish: [
          { required: true, message: '请输入菜品', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '长度在 2 到 200 个字符',
            trigger: 'blur'
          }
        ]
      },
      canteenRules: {
        name: [
          { required: true, message: '请输入食堂名称', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ],
        community: [
          { required: true, message: '请输入所属社区', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ],
        address: [
          { required: true, message: '请输入食堂地址', trigger: 'blur' },
          {
            min: 5,
            max: 200,
            message: '长度在 5 到 200 个字符',
            trigger: 'blur'
          }
        ],
        manager: [
          { required: true, message: '请输入负责人', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
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
        seats: [{ required: true, message: '请输入座位数量', trigger: 'blur' }],
        businessHours: [
          { required: true, message: '请输入营业时间', trigger: 'blur' },
          {
            min: 5,
            max: 50,
            message: '长度在 5 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 菜谱数据存储
      recipeData: {}
    }
  },
  computed: {
    currentCanteen() {
      return this.canteenList.find((item) => item.id === this.currentCanteenId)
    }
  },
  mounted() {
    this.selectCanteen(this.canteenList[0])
  },
  methods: {
    getMealTagType(meal) {
      const typeMap = {
        早餐: 'success',
        午餐: 'primary',
        晚餐: 'warning'
      }
      return typeMap[meal] || 'info'
    },

    selectCanteen(canteen) {
      this.currentCanteenId = canteen.id
      this.currentCanteen = canteen
      this.loadMenuData(canteen.id)
    },

    loadMenuData(canteenId) {
      // 从存储中获取菜谱数据
      const storedMenu = this.recipeData[canteenId]
      if (storedMenu) {
        this.menuData = storedMenu
      } else {
        // 初始化空数据
        this.menuData = [
          {
            meal: '早餐',
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: ''
          },
          {
            meal: '午餐',
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: ''
          },
          {
            meal: '晚餐',
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: ''
          }
        ]
      }
    },

    editCanteen(canteen) {
      this.canteenDialogTitle = '编辑食堂'
      this.canteenForm = { ...canteen }
      this.canteenDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.canteenForm) {
          this.$refs.canteenForm.clearValidate()
        }
      })
    },

    deleteCanteen(canteen) {
      this.$confirm(`确定要删除"${canteen.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const index = this.canteenList.findIndex(
            (item) => item.id === canteen.id
          )
          if (index !== -1) {
            this.canteenList.splice(index, 1)
            delete this.recipeData[canteen.id]

            // 如果删除的是当前选中的食堂，切换到第一个
            if (
              this.currentCanteenId === canteen.id &&
              this.canteenList.length > 0
            ) {
              this.selectCanteen(this.canteenList[0])
            } else if (this.canteenList.length === 0) {
              this.currentCanteen = null
              this.menuData = []
            }

            this.$message.success('食堂删除成功')
          }
        })
        .catch(() => {})
    },

    showAddCanteenDialog() {
      this.canteenDialogTitle = '新增食堂'
      this.resetCanteenForm()
      this.canteenDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.canteenForm) {
          this.$refs.canteenForm.clearValidate()
        }
      })
    },

    handleCanteenSubmit() {
      this.$refs.canteenForm.validate((valid) => {
        if (valid) {
          this.canteenLoading = true
          setTimeout(() => {
            if (this.canteenForm.id) {
              // 编辑
              const index = this.canteenList.findIndex(
                (item) => item.id === this.canteenForm.id
              )
              if (index !== -1) {
                this.canteenList[index] = { ...this.canteenForm }
                this.$message.success('编辑成功')
              }
            } else {
              // 新增
              const newId =
                Math.max(...this.canteenList.map((item) => item.id), 0) + 1
              const newCanteen = {
                ...this.canteenForm,
                id: newId
              }
              this.canteenList.push(newCanteen)
              this.$message.success('新增成功')
            }
            this.canteenDialogVisible = false
            this.canteenLoading = false
          }, 500)
        }
      })
    },

    resetCanteenForm() {
      this.canteenForm = {
        id: null,
        name: '',
        community: '',
        address: '',
        manager: '',
        phone: '',
        seats: 0,
        businessHours: '',
        description: ''
      }
    },

    editMenu(day, meal) {
      this.menuDialogTitle = `${day} - ${meal} - 编辑菜谱`
      this.menuForm = {
        day,
        meal,
        dish: this.getDish(day, meal),
        nutrition: ''
      }
      this.menuDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.menuForm) {
          this.$refs.menuForm.clearValidate()
        }
      })
    },

    getDish(day, meal) {
      const row = this.menuData.find((item) => item.meal === meal)
      if (row) {
        return row[day.toLowerCase()] || ''
      }
      return ''
    },

    handleMenuSubmit() {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          const row = this.menuData.find(
            (item) => item.meal === this.menuForm.meal
          )
          if (row) {
            row[this.menuForm.day.toLowerCase()] = this.menuForm.dish
            // 保存到存储
            this.recipeData[this.currentCanteenId] = JSON.parse(
              JSON.stringify(this.menuData)
            )
            this.$message.success('菜谱更新成功')
          }
          this.menuDialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.recipes-container {
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

    .header-button {
      font-weight: 500;
    }
  }

  .recipes-wrapper {
    display: flex;
    gap: 24px;
    margin-top: 24px;

    .canteen-sidebar {
      width: 280px;
      flex-shrink: 0;

      .canteen-list {
        .canteen-item {
          display: flex;
          align-items: center;
          padding: 16px;
          margin-bottom: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          background: #fafafa;
          border: 1px solid #e4e7ed;

          &.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            color: #fff;

            .canteen-info {
              .canteen-name {
                color: #fff;
              }

              .canteen-address {
                color: rgba(255, 255, 255, 0.8);
              }
            }

            .canteen-icon {
              background: rgba(255, 255, 255, 0.2);
              color: #fff;
            }
          }

          &:hover:not(.active) {
            background: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transform: translateX(4px);
          }

          .canteen-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-right: 12px;
            flex-shrink: 0;
          }

          .canteen-info {
            flex: 1;

            .canteen-name {
              font-size: 15px;
              font-weight: 600;
              color: #303133;
              margin-bottom: 4px;
            }

            .canteen-address {
              font-size: 12px;
              color: #909399;
            }
          }

          .canteen-actions {
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.3s;

            .el-button--circle {
              padding: 0;
            }
          }

          &:hover .canteen-actions {
            opacity: 1;
          }
        }
      }
    }

    .menu-content {
      flex: 1;
      background: #fafafa;
      border-radius: 8px;
      padding: 24px;

      .canteen-header {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e4e7ed;

        .canteen-title {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 8px 0;
        }

        .canteen-desc {
          font-size: 14px;
          color: #909399;
          margin: 0;
        }
      }

      .menu-table-wrapper {
        .menu-table {
          :deep(.el-table) {
            font-size: 14px;

            th {
              background-color: #f5f7fa;
              font-weight: 600;
              color: #606266;
              padding: 16px 0;
              text-align: center;
            }

            td {
              padding: 16px 0;
              text-align: center;
            }

            .cell {
              padding: 0 12px;
            }
          }

          .menu-cell {
            padding: 12px 16px;
            min-height: 50px;
            background: #fff;
            border: 1px solid #e4e7ed;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            transition: all 0.3s;
            word-break: break-all;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;

            &:hover {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #fff;
              border-color: #667eea;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
              transform: translateY(-2px);

              .edit-icon {
                opacity: 1;
              }
            }

            &.empty {
              color: #c0c4cc;
              font-style: italic;
            }

            .edit-icon {
              font-size: 14px;
              opacity: 0;
              transition: opacity 0.3s;
            }
          }
        }
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
