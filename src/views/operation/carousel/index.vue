<template>
  <div class="carousel-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>首页轮播图管理</span>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="float: right"
          @click="showAddDialog"
        >新增轮播图</el-button>
      </div>

      <!-- 轮播图列表 -->
      <div v-loading="listLoading" class="carousel-list">
        <el-empty v-if="carouselList.length === 0" description="暂无轮播图" />

        <div v-else class="carousel-items">
          <div
            v-for="(item, index) in carouselList"
            :key="item.index"
            class="carousel-item"
          >
            <div class="image-wrapper">
              <img
                :src="item.imageUrl"
                :alt="'轮播图 ' + (index + 1)"
                class="carousel-image"
                @error="handleImageError(index)"
              >
            </div>
            <div class="item-info">
              <span class="item-time">{{ formatTime(item.create_time) }}</span>
            </div>
            <div class="item-actions">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="handleDelete(item)"
              >删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      title="轮播图预览"
      :visible.sync="previewVisible"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="preview-container">
        <div class="preview-wrapper">
          <el-button
            class="preview-btn prev"
            icon="el-icon-arrow-left"
            @click="prevImage"
          />
          <img :src="currentPreviewUrl" alt="预览" class="preview-image">
          <el-button
            class="preview-btn next"
            icon="el-icon-arrow-right"
            @click="nextImage"
          />
        </div>
        <div class="preview-indicator">
          {{ currentPreviewIndex + 1 }} / {{ carouselList.length }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 新增对话框 -->
    <el-dialog
      title="新增轮播图"
      :visible.sync="addDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="add-dialog-content">
        <div class="upload-section">
          <div class="preview-wrapper">
            <div v-if="!uploadPreviewUrl" class="upload-placeholder">
              <i class="el-icon-picture-outline" />
              <p>预览图片</p>
            </div>
            <img v-else :src="uploadPreviewUrl" class="upload-preview">
          </div>
          <el-upload
            ref="upload"
            class="upload-trigger"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            accept="image/*"
          >
            <el-button type="primary" icon="el-icon-upload">选择图片</el-button>
          </el-upload>
          <p v-if="uploadStatus" class="upload-status">{{ uploadStatus }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="addLoading"
          @click="handleAddConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSlideshowList,
  addSlideshow,
  deleteSlideshow,
  uploadSlideshowImage
} from '@/api/operation'
import { fetchMediaObjectUrl } from '@/utils/media'

export default {
  name: 'Carousel',
  data() {
    return {
      listLoading: false,
      carouselList: [],
      previewVisible: false,
      currentPreviewIndex: 0,
      currentPreviewUrl: '',
      addDialogVisible: false,
      addLoading: false,
      uploadFile: null,
      uploadPreviewUrl: '',
      uploadMediaIndex: '',
      uploadStatus: ''
    }
  },
  computed: {
    hasImages() {
      return this.carouselList.length > 0
    }
  },
  mounted() {
    this.fetchCarouselList()
  },
  methods: {
    // 获取轮播图列表
    async fetchCarouselList() {
      this.listLoading = true
      try {
        const result = await getSlideshowList()
        console.log('获取轮播图列表:', result)

        if (result.slideshows && result.slideshows.length > 0) {
          // 为每个轮播图加载图片 URL
          this.carouselList = await Promise.all(
            result.slideshows.map(async(item) => ({
              ...item,
              imageUrl: await this.loadMediaUrl(item.index)
            }))
          )
        } else {
          this.carouselList = []
        }
      } catch (error) {
        console.error('获取轮播图列表失败:', error)
        this.$message.error(error.message || '获取列表失败')
        this.carouselList = []
      } finally {
        this.listLoading = false
      }
    },

    // 加载媒体文件 URL
    async loadMediaUrl(index) {
      if (!index) return ''
      try {
        return await fetchMediaObjectUrl(index)
      } catch (error) {
        console.error('加载图片失败:', error)
        return ''
      }
    },

    // 处理图片加载错误
    handleImageError(index) {
      console.error(`图片加载失败：${this.carouselList[index].index}`)
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(parseInt(timestamp) * 1000)
      return date.toLocaleString('zh-CN')
    },

    // 显示新增对话框
    showAddDialog() {
      this.uploadFile = null
      this.uploadPreviewUrl = ''
      this.uploadMediaIndex = ''
      this.uploadStatus = ''
      this.addDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
      })
    },

    // 处理文件选择
    async handleFileChange(file) {
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

      this.uploadFile = file.raw
      this.uploadStatus = '正在上传...'

      try {
        // 上传媒体文件
        const uploadResult = await uploadSlideshowImage(this.uploadFile)
        console.log('上传结果:', uploadResult)

        // 从返回结果中获取 media index
        const mediaIndex =
          uploadResult.media?.index ||
          uploadResult.data?.media?.index ||
          uploadResult.media?.uuid ||
          uploadResult.data?.media?.uuid

        if (mediaIndex) {
          this.uploadMediaIndex = mediaIndex
          this.uploadStatus = '上传成功，准备添加'

          // 生成预览 URL
          this.uploadPreviewUrl = await fetchMediaObjectUrl(mediaIndex)
          this.$message.success('图片上传成功')
        } else {
          throw new Error('未获取到媒体索引')
        }
      } catch (error) {
        console.error('图片上传失败:', error)
        this.$message.error(error.message || '图片上传失败')
        this.uploadStatus = '上传失败'
        this.uploadFile = null
        this.uploadPreviewUrl = ''
      }
    },

    // 确认添加轮播图
    async handleAddConfirm() {
      if (!this.uploadMediaIndex) {
        this.$message.warning('请先选择图片')
        return
      }

      this.addLoading = true
      try {
        const result = await addSlideshow(this.uploadMediaIndex)
        console.log('添加结果:', result)

        this.$message.success(result.message || '添加成功')
        this.addDialogVisible = false

        // 刷新列表
        await this.fetchCarouselList()
      } catch (error) {
        console.error('添加轮播图失败:', error)
        this.$message.error(error.message || '添加失败')
      } finally {
        this.addLoading = false
      }
    },

    // 删除轮播图
    async handleDelete(item) {
      const confirm = await this.$confirm(`确定要删除这张轮播图吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => false)

      if (!confirm) return

      try {
        const result = await deleteSlideshow(item.index)
        console.log('删除结果:', result)

        this.$message.success(result.message || '删除成功')

        // 刷新列表
        await this.fetchCarouselList()
      } catch (error) {
        console.error('删除轮播图失败:', error)
        this.$message.error(error.message || '删除失败')
      }
    },

    // 预览图片
    showPreview(index) {
      if (!this.hasImages) return
      this.currentPreviewIndex = index
      this.currentPreviewUrl = this.carouselList[index].imageUrl
      this.previewVisible = true
    },

    // 上一张
    prevImage() {
      if (!this.hasImages) return
      this.currentPreviewIndex =
        (this.currentPreviewIndex - 1 + this.carouselList.length) %
        this.carouselList.length
      this.currentPreviewUrl =
        this.carouselList[this.currentPreviewIndex].imageUrl
    },

    // 下一张
    nextImage() {
      if (!this.hasImages) return
      this.currentPreviewIndex =
        (this.currentPreviewIndex + 1) % this.carouselList.length
      this.currentPreviewUrl =
        this.carouselList[this.currentPreviewIndex].imageUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel-container {
  padding: 20px;
  min-height: 500px;

  .carousel-list {
    .carousel-items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;

      .carousel-item {
        border: 1px solid #ebeef5;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .image-wrapper {
          width: 100%;
          height: 180px;
          overflow: hidden;
          cursor: pointer;
          background: #f5f7fa;

          .carousel-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;

            &:hover {
              transform: scale(1.05);
            }
          }
        }

        .item-info {
          padding: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fafafa;

          .item-time {
            font-size: 12px;
            color: #c0c4cc;
          }
        }

        .item-actions {
          padding: 12px;
          text-align: center;
          border-top: 1px solid #ebeef5;
        }
      }
    }
  }
}

.preview-container {
  text-align: center;

  .preview-wrapper {
    position: relative;
    display: inline-block;
    max-width: 100%;

    .preview-image {
      max-width: 100%;
      max-height: 500px;
      border-radius: 4px;
    }

    .preview-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.5);
      border: none;
      color: #fff;
      font-size: 24px;
      padding: 20px 10px;

      &:hover {
        background: rgba(0, 0, 0, 0.7);
      }

      &.prev {
        left: 10px;
      }

      &.next {
        right: 10px;
      }
    }
  }

  .preview-indicator {
    margin-top: 10px;
    font-size: 14px;
    color: #909399;
  }
}

.add-dialog-content {
  .upload-section {
    text-align: center;
    padding: 20px;

    .preview-wrapper {
      width: 200px;
      height: 200px;
      margin: 0 auto 20px;
      border: 1px dashed #dcdfe6;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;

      .upload-placeholder {
        color: #c0c4cc;

        i {
          font-size: 48px;
        }

        p {
          margin-top: 10px;
          font-size: 14px;
        }
      }

      .upload-preview {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .upload-status {
      margin-top: 10px;
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
