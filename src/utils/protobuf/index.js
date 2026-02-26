import protobuf from 'protobufjs'

// 缓存已加载的 proto root
const protoCache = new Map()

/**
 * 将下划线命名转换为驼峰命名
 * 例如：phone_number -> phoneNumber
 */
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * 将对象的下划线命名键转换为驼峰命名键
 */
function convertKeysToCamelCase(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key)
    result[camelKey] = value
  }
  return result
}

// Proto 包名映射
const protoPackages = {
  user: 'user'
}

// Proto 文件路径映射
const protoPaths = {
  user: () => {
    const content = require('!raw-loader!@/api/proto/user.proto')
    return content.default || content
  }
}

/**
 * 加载并解析 proto 文件
 */
async function loadProto(protoName) {
  if (protoCache.has(protoName)) {
    return protoCache.get(protoName)
  }

  const loadFn = protoPaths[protoName]
  if (!loadFn) {
    throw new Error(`未找到 proto 配置：${protoName}`)
  }

  try {
    const content = loadFn()
    if (typeof content !== 'string') {
      throw new Error('proto 文件内容不是字符串')
    }
    const root = protobuf.parse(content).root
    protoCache.set(protoName, root)
    return root
  } catch (error) {
    console.error(`加载 proto 文件失败：${protoName}`, error)
    throw error
  }
}

/**
 * 将 JSON 对象序列化为 Protobuf 二进制数据
 * @param {string} protoName - proto 文件名称
 * @param {string} messageType - 消息类型
 * @param {Object} jsonData - JSON 数据对象
 * @returns {Promise<Uint8Array>} - 返回序列化后的二进制数据
 */
async function jsonToProto(protoName, messageType, jsonData) {
  const root = await loadProto(protoName)
  const packageName = protoPackages[protoName] || ''
  const fullTypeName = packageName
    ? `${packageName}.${messageType}`
    : messageType
  const Type = root.lookupType(fullTypeName)

  // 将下划线命名转换为驼峰命名（protobufjs 使用驼峰命名）
  const camelCaseData = convertKeysToCamelCase(jsonData)

  // 创建消息并序列化
  const message = Type.create(camelCaseData)
  const buffer = Type.encode(message).finish()

  return buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
}

/**
 * 将 Protobuf 二进制数据反序列化为 JSON 对象
 * @param {string} protoName - proto 文件名称
 * @param {string} messageType - 消息类型
 * @param {Uint8Array|ArrayBuffer} buffer - 二进制数据
 * @returns {Promise<Object>} - 返回反序列化后的 JSON 对象
 */
async function protoToJson(protoName, messageType, buffer) {
  const root = await loadProto(protoName)
  const packageName = protoPackages[protoName] || ''
  const fullTypeName = packageName
    ? `${packageName}.${messageType}`
    : messageType
  const Type = root.lookupType(fullTypeName)

  // 反序列化
  const message = Type.decode(new Uint8Array(buffer))

  // 转换为普通对象
  return Type.toObject(message, {
    enums: String,
    longs: String,
    bytes: String,
    defaults: true
  })
}

/**
 * 获取消息类型定义
 */
async function getType(protoName, messageType) {
  const root = await loadProto(protoName)
  return root.lookupType(messageType)
}

/**
 * 创建简化的 API 调用封装
 */
function createProtoApi(protoName, requestType, responseType, requestFn) {
  return async function(data) {
    const protoBuffer = await jsonToProto(protoName, requestType, data)
    const response = await requestFn(protoBuffer)
    return await protoToJson(protoName, responseType, response.data)
  }
}

// 导出工具方法
export default {
  loadProto,
  jsonToProto,
  protoToJson,
  getType,
  createProtoApi
}
