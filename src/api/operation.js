import request from '@/utils/request'
import proto from '@/utils/protobuf'

/**
 * 获取轮播图列表 - 使用 Proto 序列化
 * @returns {Promise<Object>} - 返回轮播图列表
 */
export function getSlideshowList() {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        console.log('[getSlideshowList] 发送请求：GET /slide_show')
        const response = await request({
          url: '/slide_show',
          method: 'get',
          responseType: 'arraybuffer'
        })

        const result = await proto.protoToJson(
          'slideshow',
          'SlideshowResponse',
          response.data
        )

        console.log('[getSlideshowList] 接收响应:', result)

        if (result.code !== 200) {
          reject(new Error(result.message || '获取轮播图列表失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('获取轮播图列表失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 新增轮播图 - POST /slide_show?index=xxxxx
 * @param {string} index - 媒体文件索引/UUID
 * @returns {Promise<Object>}
 */
export function addSlideshow(index) {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        console.log('[addSlideshow] 发送请求:', { index })
        const response = await request({
          url: `/slide_show?index=${index}`,
          method: 'post',
          responseType: 'arraybuffer'
        })

        const result = await proto.protoToJson(
          'slideshow',
          'SlideshowResponse',
          response.data
        )

        console.log('[addSlideshow] 接收响应:', result)

        if (result.code !== 200) {
          reject(new Error(result.message || '新增轮播图失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('新增轮播图失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 删除轮播图 - DELETE /slide_show?index=xxx
 * @param {string} index - 媒体文件索引/UUID
 * @returns {Promise<Object>}
 */
export function deleteSlideshow(index) {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        console.log('[deleteSlideshow] 发送请求:', { index })
        const response = await request({
          url: `/slide_show?index=${index}`,
          method: 'delete',
          responseType: 'arraybuffer'
        })

        const result = await proto.protoToJson(
          'slideshow',
          'SlideshowResponse',
          response.data
        )

        console.log('[deleteSlideshow] 接收响应:', result)

        if (result.code !== 200) {
          reject(new Error(result.message || '删除轮播图失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('删除轮播图失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 上传轮播图图片 - POST /mutil_media?compress=true
 * @param {File} file - 文件对象
 * @returns {Promise<Object>} - 返回上传结果 { media: { index: 'uuid' } }
 */
export function uploadSlideshowImage(file) {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        console.log('[uploadSlideshowImage] 发送请求:', {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        })
        const formData = new FormData()
        formData.append('file', file)

        const response = await request({
          url: '/mutil_media?compress=true',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log('[uploadSlideshowImage] 接收响应:', response)

        if (response.code !== 200) {
          reject(new Error(response.message || '上传图片失败'))
          return
        }

        resolve(response)
      } catch (error) {
        console.error('上传图片失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 获取温馨提示 - 使用 Proto 序列化
 * @returns {Promise<Object>} - 返回温馨提示信息
 */
export function getNotice() {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        console.log('[getNotice] 发送请求：GET /notice/insert')
        const response = await request({
          url: '/notice/insert',
          method: 'get',
          responseType: 'arraybuffer'
        })

        const result = await proto.protoToJson(
          'notice',
          'NoticeResponse',
          response.data
        )

        console.log('[getNotice] 接收响应:', result)

        if (result.code !== 200) {
          reject(new Error(result.message || '获取温馨提示失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('获取温馨提示失败:', error)
        reject(error)
      }
    })()
  })
}

/**
 * 新增温馨提示 - POST /notice/insert
 * @param {string} content - 温馨提示内容
 * @returns {Promise<Object>}
 */
export function addNotice(content) {
  return new Promise((resolve, reject) => {
    (async() => {
      try {
        console.log('[addNotice] 发送请求:', { content })
        const protoBuffer = await proto.jsonToProto('notice', 'NoticeRequest', {
          content
        })

        const response = await request({
          url: '/notice/insert',
          method: 'post',
          data: protoBuffer,
          responseType: 'arraybuffer',
          transformRequest: [(data) => data],
          headers: {
            'Content-Type': 'application/x-protobuf'
          }
        })

        const result = await proto.protoToJson(
          'notice',
          'NoticeResponse',
          response.data
        )

        console.log('[addNotice] 接收响应:', result)

        if (result.code !== 200) {
          reject(new Error(result.message || '新增温馨提示失败'))
          return
        }

        resolve(result)
      } catch (error) {
        console.error('新增温馨提示失败:', error)
        reject(error)
      }
    })()
  })
}
