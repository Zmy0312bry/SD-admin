
/**
 * 媒体文件基础 URL
 */
const MEDIA_BASE_URL = process.env.VUE_APP_BASE_API || '/api'

/**
 * 获取媒体文件 URL
 * @param {string} uuid - 媒体文件索引/UUID
 * @returns {string} - 完整的媒体文件 URL
 */
export function getMediaUrl(uuid) {
  if (!uuid) {
    return ''
  }
  return `${MEDIA_BASE_URL}/mutil_media/download?uuid=${uuid}`
}

/**
 * 获取媒体文件（返回 Blob）
 * @param {string} uuid - 媒体文件索引/UUID
 * @returns {Promise<Blob>} - 返回 Blob 对象
 */
export async function fetchMediaBlob(uuid) {
  if (!uuid) {
    throw new Error('UUID is required')
  }

  const response = await fetch(`${MEDIA_BASE_URL}/mutil_media/download?uuid=${uuid}}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.status}`)
  }

  return response.blob()
}

/**
 * 获取媒体文件并转换为 Base64
 * @param {string} uuid - 媒体文件索引/UUID
 * @returns {Promise<string>} - 返回 Base64 字符串
 */
export async function fetchMediaBase64(uuid) {
  const blob = await fetchMediaBlob(uuid)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * 获取媒体文件并创建 Object URL
 * @param {string} uuid - 媒体文件索引/UUID
 * @returns {Promise<string>} - 返回 Object URL（需要手动释放）
 */
export async function fetchMediaObjectUrl(uuid) {
  const blob = await fetchMediaBlob(uuid)
  return URL.createObjectURL(blob)
}

/**
 * 下载媒体文件
 * @param {string} uuid - 媒体文件索引/UUID
 * @param {string} filename - 下载后的文件名
 */
export async function downloadMedia(uuid, filename = 'download') {
  const blob = await fetchMediaBlob(uuid)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 获取头像 URL（如果 avatar 是 UUID，则返回媒体 URL；否则返回原始值或默认头像）
 * @param {string} avatar - 头像 UUID 或 URL
 * @param {string} defaultAvatar - 默认头像 URL
 * @returns {string} - 头像 URL
 */
export function getAvatarUrl(avatar, defaultAvatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif') {
  if (!avatar) {
    return defaultAvatar
  }
  // 如果 avatar 看起来像是 UUID（只包含字母数字和横线），则认为是媒体索引
  if (/^[a-fA-F0-9-]{8,}$/.test(avatar)) {
    return getMediaUrl(avatar)
  }
  // 否则直接返回原始值（可能是完整 URL）
  return avatar
}

export default {
  getMediaUrl,
  fetchMediaBlob,
  fetchMediaBase64,
  fetchMediaObjectUrl,
  downloadMedia,
  getAvatarUrl
}
