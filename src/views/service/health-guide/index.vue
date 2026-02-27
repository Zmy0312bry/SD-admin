```vue D:\SD-admin\src\views\service\health-guide\index\vue
<template>
  <div class="health-guide-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">健康指导管理</span>
        <div class="header-actions">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="showAddCategoryDialog"
          >
            新增大板块
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
          ref="guideTree"
          :data="guideTree"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          node-key="id"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <!-- 一级：健康指导大板块 -->
            <div v-if="data.level === 1" class="category-node">
              <i class="el-icon-s-opportunity category-icon" />
              <span class="node-label">{{ node.label }}</span>
              <span class="node-desc">{{ data.description }}</span>
              <span class="node-actions">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-plus"
                  @click="showAddSubcategoryDialog(data)"
                >
                  添加小类目
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editCategory(data)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click="removeCategory(node, data)"
                >
                  删除
                </el-button>
              </span>
            </div>

            <!-- 二级：小类目（可选） -->
            <div v-else-if="data.level === 2" class="subcategory-node">
              <i class="el-icon-folder-opened subcategory-icon" />
              <span class="node-label">{{ node.label }}</span>
              <span class="node-desc">{{ data.description }}</span>
              <span class="node-actions">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-plus"
                  @click="showAddGuideDialog(data)"
                >
                  添加指导内容
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click="removeSubcategory(node, data)"
                >
                  删除
                </el-button>
              </span>
            </div>

            <!-- 三级：具体条目 -->
            <div v-else-if="data.level === 3" class="guide-item-node">
              <i class="el-icon-document guide-icon" />
              <span class="node-label">{{ node.label }}</span>
              <span class="node-desc">{{ data.summary }}</span>
              <span class="node-actions">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-view"
                  @click="viewGuide(data)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editGuide(data)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click="removeGuide(node, data)"
                >
                  删除
                </el-button>
              </span>
            </div>
          </span>
        </el-tree>
      </div>
    </el-card>

    <!-- 新增大板块对话框 -->
    <el-dialog
      title="新增健康指导大板块"
      :visible.sync="addCategoryDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="categoryForm"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="100px"
      >
        <el-form-item label="板块名称" prop="name">
          <el-input
            v-model="categoryForm.name"
            placeholder="请输入板块名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="板块描述" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入板块描述"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCategory">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增小类目对话框 -->
    <el-dialog
      title="新增小类目"
      :visible.sync="addSubcategoryDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="subcategoryForm"
        :model="subcategoryForm"
        :rules="subcategoryRules"
        label-width="100px"
      >
        <el-form-item label="类目名称" prop="name">
          <el-input
            v-model="subcategoryForm.name"
            placeholder="请输入类目名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="类目描述" prop="description">
          <el-input
            v-model="subcategoryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入类目描述"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="addSubcategoryDialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddSubcategory"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增指导内容对话框 -->
    <el-dialog
      title="新增健康指导内容"
      :visible.sync="addGuideDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="guideForm"
        :model="guideForm"
        :rules="guideRules"
        label-width="100px"
      >
        <el-form-item label="指导标题" prop="title">
          <el-input
            v-model="guideForm.title"
            placeholder="请输入指导标题"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item label="指导内容" prop="content">
          <el-input
            v-model="guideForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入指导内容"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="简短摘要" prop="summary">
          <el-input
            v-model="guideForm.summary"
            type="textarea"
            :rows="2"
            placeholder="请输入简短摘要"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="guideForm.tags"
            multiple
            placeholder="请选择标签"
            style="width: 100%"
          >
            <el-option label="养生保健" value="养生保健" />
            <el-option label="饮食营养" value="饮食营养" />
            <el-option label="运动健身" value="运动健身" />
            <el-option label="心理健康" value="心理健康" />
            <el-option label="慢性病管理" value="慢性病管理" />
            <el-option label="用药指导" value="用药指导" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGuideDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddGuide">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看指导详情对话框 -->
    <el-dialog
      title="健康指导详情"
      :visible.sync="guideDetailVisible"
      width="600px"
      append-to-body
    >
      <div class="guide-detail">
        <h3 class="detail-title">{{ guideDetailData.title }}</h3>
        <div class="detail-meta">
          <el-tag
            v-for="(tag, index) in guideDetailData.tags"
            :key="index"
            size="small"
            style="margin-right: 8px"
          >
            {{ tag }}
          </el-tag>
        </div>
        <div class="detail-summary">
          <strong>摘要：</strong>{{ guideDetailData.summary }}
        </div>
        <div class="detail-content">
          <strong>指导内容：</strong>
          <p>{{ guideDetailData.content }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="guideDetailVisible = false"
        >关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'HealthGuide',
  data() {
    return {
      guideTree: [
        {
          id: 1,
          label: '养生保健指南',
          level: 1,
          description: '老年人在日常生活中需要了解的养生保健知识',
          children: [
            {
              id: 11,
              label: '饮食养生',
              level: 2,
              description: '关于老年人合理饮食、营养搭配的指导',
              children: [
                {
                  id: 111,
                  label: '老年人饮食原则',
                  level: 3,
                  summary: '少盐少油，清淡饮食，营养均衡',
                  content:
                    '1. 控制盐的摄入：每日食盐摄入量不超过6克\n2. 控制油脂摄入：选择低脂肪食物，少吃油炸食品\n3. 增加膳食纤维：多吃蔬菜水果，促进消化\n4. 适量优质蛋白：每天摄入适量优质蛋白质\n5. 规律饮食：定时定量，避免暴饮暴食',
                  tags: ['饮食营养', '日常保健']
                },
                {
                  id: 112,
                  label: '四季养生要点',
                  level: 3,
                  summary: '根据季节变化调整饮食结构',
                  content:
                    '春季养肝：宜食绿色蔬菜，少吃酸味食物\n夏季养心：宜食清热解暑食物，如绿豆汤\n秋季养肺：宜食润肺食物，如梨、百合\n冬季养肾：宜食温补食物，如羊肉、红枣',
                  tags: ['季节养生', '中医保健']
                },
                {
                  id: 113,
                  label: '常见慢病饮食禁忌',
                  level: 3,
                  summary: '高血压、糖尿病等疾病的饮食禁忌',
                  content:
                    '高血压患者：低盐饮食，避免腌制食品\n糖尿病患者：低糖低脂，控制主食摄入\n高血脂患者：低脂饮食，避免动物内脏\n痛风患者：低嘌呤饮食，避免海鲜和内脏',
                  tags: ['慢性病管理', '饮食禁忌']
                }
              ]
            },
            {
              id: 12,
              label: '运动健身',
              level: 2,
              description: '适合老年人的运动方式和健身建议',
              children: [
                {
                  id: 121,
                  label: '日常运动建议',
                  level: 3,
                  summary: '每日适量运动，保持身体活力',
                  content:
                    '1. 每天运动30-60分钟\n2. 选择低强度运动，如散步、太极、八段锦\n3. 避免剧烈运动，防止意外伤害\n4. 运动前要热身，运动后要放松\n5. 根据个人体质调整运动强度',
                  tags: ['运动健身', '日常建议']
                },
                {
                  id: 122,
                  label: '康复训练指导',
                  level: 3,
                  summary: '康复期间的运动注意事项',
                  content:
                    '1. 术后或伤病后要在医生指导下进行康复训练\n2. 循序渐进，不要急于求成\n3. 注意安全，避免二次伤害\n4. 坚持训练，才能达到最佳康复效果\n5. 配合其他治疗手段，综合康复',
                  tags: ['康复训练', '专业指导']
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '心理健康',
          level: 1,
          description: '关注老年人心理状态，提供心理支持和疏导',
          children: [
            {
              id: 21,
              label: '常见心理问题',
              level: 2,
              description: '老年人常见的心理问题及应对方法',
              children: [
                {
                  id: 211,
                  label: '孤独感与寂寞',
                  level: 3,
                  summary: '老年人常有的心理问题及应对策略',
                  content:
                    '症状表现：不愿与人交流，情绪低落，兴趣丧失\n应对方法：1. 多参与社交活动\n2. 培养兴趣爱好\n3. 定期与家人朋友联系\n4. 必要时寻求专业帮助\n5. 保持积极乐观的心态',
                  tags: ['心理调适', '情感支持']
                },
                {
                  id: 212,
                  label: '焦虑与失眠',
                  level: 3,
                  summary: '老年人常见的焦虑和睡眠问题',
                  content:
                    '焦虑缓解方法：\n1. 深呼吸放松\n2. 冥想静坐\n3. 音乐疗法\n4. 与人倾诉\n\n睡眠改善建议：\n1. 建立规律的作息时间\n2. 睡前避免刺激性活动\n3. 创造舒适的睡眠环境\n4. 避免午睡时间过长\n5. 必要时遵医嘱用药',
                  tags: ['心理调适', '睡眠改善']
                }
              ]
            },
            {
              id: 22,
              label: '情绪管理',
              level: 2,
              description: '学会管理自己的情绪，保持心理平衡',
              children: [
                {
                  id: 221,
                  label: '负面情绪调节',
                  level: 3,
                  summary: '如何有效调节负面情绪',
                  content:
                    '1. 认识并接纳自己的情绪\n2. 找到情绪的根源\n3. 转移注意力，做喜欢的事情\n4. 与信任的人分享\n5. 学习情绪管理技巧\n6. 保持积极的生活态度',
                  tags: ['情绪管理', '自我调节']
                },
                {
                  id: 222,
                  label: '压力释放',
                  level: 3,
                  summary: '有效释放压力的方法',
                  content:
                    '1. 适度运动，释放压力\n2. 写日记，记录内心感受\n3. 听音乐，放松心情\n4. 与朋友聊天，倾诉烦恼\n5. 接触自然，放松身心\n6. 培养兴趣爱好，充实生活',
                  tags: ['压力管理', '放松技巧']
                }
              ]
            }
          ]
        },
        {
          id: 3,
          label: '用药指导',
          level: 1,
          description: '老年人用药的注意事项和安全指南',
          children: [
            {
              id: 31,
              label: '用药安全',
              level: 2,
              description: '老年人用药的安全意识和注意事项',
              children: [
                {
                  id: 311,
                  label: '用药原则',
                  level: 3,
                  summary: '老年人用药的基本原则',
                  content:
                    '1. 遵医嘱，按时按量服药\n2. 不要随意停药或增减药量\n3. 注意药物之间的相互作用\n4. 了解药物的不良反应\n5. 定期复查，调整用药方案\n6. 保存用药记录，方便医生查看',
                  tags: ['用药原则', '安全用药']
                },
                {
                  id: 312,
                  label: '特殊注意事项',
                  level: 3,
                  summary: '特殊情况下的用药注意事项',
                  content:
                    '1. 肝肾功能不全者：避免肾毒性药物\n2. 肝功能不全者：避免肝毒性药物\n3. 有过敏史者：避免过敏药物\n4. 老年人：注意药物剂量调整\n5. 有其他疾病者：注意药物禁忌症\n6. 用药期间避免饮酒',
                  tags: ['特殊用药', '注意事项']
                }
              ]
            },
            {
              id: 32,
              label: '慢性病用药',
              level: 2,
              description: '常见慢性病的用药指导',
              children: [
                {
                  id: 321,
                  label: '高血压用药',
                  level: 3,
                  summary: '高血压患者的用药指导',
                  content:
                    '常用降压药物：\n1. 钙离子通道阻滞剂\n2. ACE抑制剂\n3. ARB类药物\n4. β受体阻滞剂\n\n用药注意事项：\n1. 每天定时服药\n2. 不要随意停药\n3. 定期测量血压\n4. 注意观察不良反应\n5. 定期复查调整',
                  tags: ['高血压', '降压药']
                },
                {
                  id: 322,
                  label: '糖尿病用药',
                  level: 3,
                  summary: '糖尿病患者的用药指导',
                  content:
                    '常用降糖药物：\n1. 二甲双胍\n2. 胰岛素及类似物\n3. DPP-4抑制剂\n\n用药注意事项：\n1. 按时按量服药\n2. 定期监测血糖\n3. 注意低血糖反应\n4. 饮食配合药物治疗\n5. 保持规律作息',
                  tags: ['糖尿病', '降糖药']
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
      addCategoryDialogVisible: false,
      addSubcategoryDialogVisible: false,
      addGuideDialogVisible: false,
      guideDetailVisible: false,
      categoryForm: {
        name: '',
        description: ''
      },
      subcategoryForm: {
        name: '',
        description: '',
        categoryId: null,
        categoryName: ''
      },
      guideForm: {
        title: '',
        content: '',
        summary: '',
        tags: [],
        subcategoryId: null,
        subcategoryName: '',
        categoryId: null,
        categoryName: ''
      },
      categoryRules: {
        name: [
          { required: true, message: '请输入板块名称', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      subcategoryRules: {
        name: [
          { required: true, message: '请输入类目名称', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      guideRules: {
        title: [
          { required: true, message: '请输入指导标题', trigger: 'blur' },
          {
            min: 5,
            max: 100,
            message: '长度在 5 到 100 个字符',
            trigger: 'blur'
          }
        ],
        content: [
          { required: true, message: '请输入指导内容', trigger: 'blur' },
          {
            min: 10,
            max: 1000,
            message: '长度在 10 到 1000 个字符',
            trigger: 'blur'
          }
        ],
        summary: [
          { required: true, message: '请输入简短摘要', trigger: 'blur' },
          {
            min: 10,
            max: 200,
            message: '长度在 10 到 200 个字符',
            trigger: 'blur'
          }
        ]
      },
      guideDetailData: {}
    }
  },
  methods: {
    showAddCategoryDialog() {
      this.categoryForm = { name: '', description: '' }
      this.addCategoryDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.categoryForm) {
          this.$refs.categoryForm.clearValidate()
        }
      })
    },

    handleAddCategory() {
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          const newId =
            Math.max(...this.guideTree.map((item) => item.id), 0) + 1
          const newCategory = {
            id: newId,
            label: this.categoryForm.name,
            level: 1,
            description: this.categoryForm.description,
            children: []
          }
          this.guideTree.push(newCategory)
          this.$message.success('大板块添加成功')
          this.addCategoryDialogVisible = false
        }
      })
    },

    editCategory(data) {
      this.$message.info('编辑大板块功能待实现')
    },

    removeCategory(node, data) {
      this.$confirm(`确定要删除大板块"${data.label}"及其所有内容吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const index = this.guideTree.findIndex((item) => item.id === data.id)
          if (index !== -1) {
            this.guideTree.splice(index, 1)
            this.$message.success('大板块删除成功')
          }
        })
        .catch(() => {})
    },

    showAddSubcategoryDialog(category) {
      this.subcategoryForm = {
        name: '',
        description: '',
        categoryId: category.id,
        categoryName: category.label
      }
      this.addSubcategoryDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.subcategoryForm) {
          this.$refs.subcategoryForm.clearValidate()
        }
      })
    },

    handleAddSubcategory() {
      this.$refs.subcategoryForm.validate((valid) => {
        if (valid) {
          const category = this.guideTree.find(
            (item) => item.id === this.subcategoryForm.categoryId
          )
          if (category) {
            const newId =
              Math.max(
                ...this.guideTree.flatMap((item) =>
                  item.children.map((child) => child.id)
                ),
                0
              ) + 1
            const newSubcategory = {
              id: newId,
              label: this.subcategoryForm.name,
              level: 2,
              description: this.subcategoryForm.description,
              children: []
            }
            category.children.push(newSubcategory)
            this.$message.success('小类目添加成功')
            this.addSubcategoryDialogVisible = false
          }
        }
      })
    },

    removeSubcategory(node, data) {
      this.$confirm(
        `确定要删除小类目"${data.label}"及其所有指导内容吗？`,
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
            this.$message.success('小类目删除成功')
          }
        })
        .catch(() => {})
    },

    showAddGuideDialog(subcategory) {
      this.guideForm = {
        title: '',
        content: '',
        summary: '',
        tags: [],
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.label,
        categoryId: subcategory.node.parent.data.id,
        categoryName: subcategory.node.parent.data.label
      }
      this.addGuideDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.guideForm) {
          this.$refs.guideForm.clearValidate()
        }
      })
    },

    handleAddGuide() {
      this.$refs.guideForm.validate((valid) => {
        if (valid) {
          const parent = this.$refs.guideTree.getNode(
            this.guideForm.subcategoryId
          ).parent.data
          const subcategory = parent.children.find(
            (item) => item.id === this.guideForm.subcategoryId
          )
          if (subcategory) {
            const newId =
              Math.max(
                ...this.guideTree.flatMap(
                  (item) =>
                    item.children.flatMap((child) =>
                      child.children.map((guide) => guide.id)
                    ),
                  0
                )
              ) + 1
            const newGuide = {
              id: newId,
              label: this.guideForm.title,
              level: 3,
              summary: this.guideForm.summary,
              content: this.guideForm.content,
              tags: this.guideForm.tags
            }
            subcategory.children.push(newGuide)
            this.$message.success('指导内容添加成功')
            this.addGuideDialogVisible = false
          }
        }
      })
    },

    editGuide(data) {
      this.$message.info('编辑指导内容功能待实现')
    },

    viewGuide(data) {
      this.guideDetailData = { ...data }
      this.guideDetailVisible = true
    },

    removeGuide(node, data) {
      this.$confirm(`确定要删除指导内容"${data.label}"吗？`, '提示', {
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
            this.$message.success('指导内容删除成功')
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
.health-guide-container {
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
    margin-top: 24px;
    padding: 24px;
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

      // 一级：健康指导大板块样式 - 突出显示
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

      // 二级：小类目样式 - 增加缩进
      .subcategory-node {
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

        .subcategory-icon {
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

      // 三级：具体指导条目样式 - 最大缩进
      .guide-item-node {
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

        .guide-icon {
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

  .guide-detail {
    .detail-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 16px 0;
      padding-bottom: 12px;
      border-bottom: 1px solid #e4e7ed;
    }

    .detail-meta {
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .detail-summary {
      margin-bottom: 16px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 4px;
      color: #606266;
      line-height: 1.8;
    }

    .detail-content {
      color: #303133;
      line-height: 1.8;

      strong {
        font-weight: 600;
        color: #303133;
      }

      p {
        white-space: pre-wrap;
        word-break: break-word;
        margin: 8px 0;
      }
    }
  }
}
</style>
