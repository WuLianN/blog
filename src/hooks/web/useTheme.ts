import { rgbaToHex, generateLightColor } from '@/utils/color'

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

function getLocalColor(localName = 'primaryColor') {
  return window.localStorage.getItem(localName)
}

export function useTheme(cssVarName = '--el-color-primary', localName?: string, selectedColor?: string) {
  let color

  if (selectedColor) {
    // 用户传入主题色
    color = selectedColor
    // 存储用户的主题色
    localName && localStorage.setItem(localName, color)
  } else {
    // 获取本地主题色
    color = getLocalColor(localName) || getColor(cssVarName)
  }

  const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/i.test(color);

  let hex
  if (isValidHex) {
    hex = color
  } else {
    hex = rgbaToHex(color)
  }

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
  for (let i = 1; i < 10; i++) {
    setColorMixLevel(cssVarName, i, 'light', hex)
  }

  // --el-color-primary-dark-2
  setColorMixLevel(cssVarName, 2, 'dark', hex)
}

export function setupTheme() {
  useTheme('--el-color-primary')
}