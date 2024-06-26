import { generateLightColor, rgbaToHex } from '@/utils/color'

function getColor(cssVarName: string): string {
  const el = document.documentElement
  return getComputedStyle(el).getPropertyValue(cssVarName)
}

function setColor(cssVarName: string, color: string) {
  const el = document.documentElement

  el.style.setProperty(cssVarName, color)
}

function setColorMixLevel(name: string, number: number, mode: 'light' | 'dark', baseColor: string) {
  const color = generateLightColor(baseColor, number * 10)

  const varName = `${name}-${mode}-${number}`

  setColor(varName, color)
}

function getLocalColor(): string {
  const userSetting = localStorage.getItem('user_setting')
  if (userSetting) {
    const { primary_color } = JSON.parse(userSetting)
    return primary_color
  }
  return ''
}

export function useTheme(cssVarName = '--el-color-primary', selectedColor?: string): void {
  let color

  if (selectedColor) {
    // 用户传入主题色
    color = selectedColor
  }
  else {
    // 获取本地主题色
    color = getLocalColor() || getColor(cssVarName)
  }

  // 没获取到color 停止
  if (!color)
    return

  const isValidHex = /^#([A-F0-9]{6}|[A-F0-9]{8})$/i.test(color)

  let hex
  if (isValidHex)
    hex = color
  else
    hex = rgbaToHex(color)

  setColor(cssVarName, color)

  // --el-color-primary-light-i
  // 10% 53a8ff
  // 20% 66b1ff
  // 30% 79bbff
  // 40% 8cc5ff
  // 50% a0cfff
  // 60% b3d8ff
  // 70% c6e2ff
  // 80% d9ecff
  // 90% ecf5ff
  for (let i = 1; i < 10; i++)
    setColorMixLevel(cssVarName, i, 'light', hex)

  // --el-color-primary-dark-2
  setColorMixLevel(cssVarName, 2, 'dark', hex)
}

export function setupTheme() {
  useTheme('--el-color-primary')
}
