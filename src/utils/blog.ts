import { getExcerpt } from './three_party'
import type { RecommendDraft } from '@/api/model/draftsModel'
import { getUserId } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

/**
 * 获取给定文本中的第一个图片链接
 * @param text 给定的文本
 * @returns 返回第一个图片链接，如果没有找到则返回null
 */
export function getFirstImageUrl(text: string): (string | null) {
  // 常见的图片文件后缀
  const imageExtensions = /\.(jpeg|jpg|png|gif|bmp|webp|svg|ico)(\?[^#]*)?(#.*)?$/i

  // 匹配HTML img标签和带有http或https协议的Markdown风格的图片链接
  const htmlImgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/i
  const markdownImgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/i

  // 先尝试匹配HTML img标签
  let match = text.match(htmlImgRegex)

  if (match && match[1] && imageExtensions.test(match[1])) {
    return match[1]
  }

  // 再尝试匹配Markdown格式的图片
  match = text.match(markdownImgRegex)

  if (match && match[1] && imageExtensions.test(match[1])) {
    return match[1]
  }

  return null // 没有找到任何图片链接
}

export function buildRecommendList(list: RecommendDraft[]) {
  list.forEach((item) => {
    if (item.content) {
      item.excerpt = getExcerpt(item.content as string)
      // 获取一个图片链接 1背景图 2插图
      item.bgImage = item.bg_image ? item.bg_image : getFirstImageUrl(item.content as string)
    }
  })
  return list
}

/**
 * 获取用户ID
 * 优先级 访客模式 > 登录模式
 * 访客模式 getUserId() /user/1 -> 1
 * 登录模式 store或localStorage中获取id
 * @returns 返回用户ID，如果没有找到则返回null
 */
export function findUserId() {
  const userId = getUserId() || userStore.userInfo.id || JSON.parse(localStorage.getItem('userInfo') || '{}')?.id
  return userId
}
