/**
 * 比较函数，用于对对象数组进行排序，支持数字和特定格式日期时间字符串的比较。
 *
 * @param {T} a - 第一个待比较的对象，需包含用于排序的属性`key`。
 * @param {T} b - 第二个待比较的对象，需与`a`具有相同的结构且包含属性`key`。
 * @param {keyof T} key - 用于比较的属性名称，此属性应存在于`a`和`b`对象中。
 * @param {boolean} [isAscending] - 排序方向标志，`true`为升序，`false`为降序。
 *
 * @returns {number} 返回值指示了`a`和`b`之间的排序关系：
 *         - 小于0，表示`a`应该排在`b`之前（升序）；
 *         - 等于0，表示`a`和`b`相等；
 *         - 大于0，表示`a`应该排在`b`之后（降序）。
 *
 * @throws {Error} 当`key`指定的属性不能被转换为数字或日期进行比较时抛出错误。
 */
export function compareFn<T>(a: T, b: T, key: keyof T, isAscending = true): number {
  const A = a[key]
  const B = b[key]

  // 支持 YYYY-MM-DDTHH:mm:ss±HH:mm
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?([+-]\d{2}:?\d{2}|Z)?$/

  let numA: number | Date
  let numB: number | Date

  if (typeof A === 'string' && dateTimeRegex.test(A))
    numA = new Date(A)
  else if (typeof A === 'string' || typeof A === 'number')
    numA = Number(A)
  else
    throw new Error(`Property '${String(key)}' of object 'a' cannot be compared.`)

  if (typeof B === 'string' && dateTimeRegex.test(B))
    numB = new Date(B)
  else if (typeof B === 'string' || typeof B === 'number')
    numB = Number(B)
  else
    throw new Error(`Property '${String(key)}' of object 'b' cannot be compared.`)

  // 对Date对象和数字进行分别处理
  if (numA instanceof Date && numB instanceof Date)
    return isAscending ? numA.getTime() - numB.getTime() : numB.getTime() - numA.getTime()
  else
    return isAscending ? Number(numA) - Number(numB) : Number(numB) - Number(numA)
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
