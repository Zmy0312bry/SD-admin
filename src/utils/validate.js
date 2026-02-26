/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} str - 手机号
 * @returns {Boolean}
 */
export function validatePhone(str) {
  if (!str) {
    return false
  }
  // 中国大陆手机号：11 位数字，以 1 开头，第二位为 3-9
  const reg = /^1[3-9]\d{9}$/
  return reg.test(str)
}
