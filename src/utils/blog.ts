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
  // 匹配HTML img标签和带有http或https协议的Markdown风格的图片链接
  const regex = /<img[^>]+src="([^"]+)"|!\[.*?\]\((https?:\/\/[^)]+)\)/i

  // 先尝试匹配HTML img标签
  const match = text.match(regex)

  if (match) {
    // 如果找到HTML img标签，则返回src属性值；如果是带有协议的Markdown格式，则返回URL部分
    return match[1] ? match[1] : match[2] // 匹配两种格式的图片链接
  }
  else {
    return null // 没有找到任何图片链接
  }
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
