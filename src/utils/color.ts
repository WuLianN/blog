export function rgbaToHex(rgbaColor: string) {
  // 分离 RGBA 颜色值
  if (rgbaColor.match(/\d+/g) == null)
    return rgbaColor

  // @ts-expect-error null的情况已经拦截了
  const [r, g, b, a] = rgbaColor.match(/\d+/g).map(Number)

  // 确保 RGB 值在0-255范围内，并转换为十六进制
  const hexR = r.toString(16).padStart(2, '0')
  const hexG = g.toString(16).padStart(2, '0')
  const hexB = b.toString(16).padStart(2, '0')

  // 将 alpha 转换为百分比并取整，然后转换为两位十六进制数
  const hexA = Math.round(a * 255).toString(16).padStart(2, '0')

  return `#${hexR}${hexG}${hexB}${hexA}`
}

export function generateLightColor(baseColor: string, percentage: number): string {
  // 检查输入是否为有效的6位或8位十六进制颜色字符串
  const isValidHex = /^#([A-F0-9]{6}|[A-F0-9]{8})$/i.test(baseColor)
  if (!isValidHex) {
    console.error('Invalid hex color format')
    return baseColor // 或者返回一个默认颜色
  }

  const r = Number.parseInt(baseColor.substring(1, 3), 16)
  const g = Number.parseInt(baseColor.substring(3, 5), 16)
  const b = Number.parseInt(baseColor.substring(5, 7), 16)

  // 处理RGBA颜色（如果存在 alpha 通道）
  const isRGBA = baseColor.length === 9
  let a = 255 // 默认alpha值为255（不透明）

  if (isRGBA) {
    const aStr = baseColor.substring(7, 9)
    a = Number.parseInt(aStr, 16)
  }

  const newR = Math.round(r + (255 - r) * percentage / 100)
  const newG = Math.round(g + (255 - g) * percentage / 100)
  const newB = Math.round(b + (255 - b) * percentage / 100)

  // 如果原色是RGBA，则生成的新颜色也是RGBA
  return isRGBA
    ? `rgba(${newR}, ${newG}, ${newB}, ${a / 255})`
    : `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}
