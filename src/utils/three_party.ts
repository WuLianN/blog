import matter from 'gray-matter'
import { useDateFormat } from '@vueuse/core'
export function getExcerpt(value: string): string {
  const summaryLength = 200
  const { content } = matter(value);
  const sanitizedContent = content.trim().replaceAll(/#+\s+(.+)/g, '')
  const ellipsis = sanitizedContent.length > 200 ? ' ...' : ''
  const excerpt = sanitizedContent.trim().slice(0, summaryLength) + ellipsis

  return excerpt
}

export function formatDate(date: Date, formatStr = "YYYY-MM-DD HH:mm:ss", options = {}) {
  return useDateFormat(date, formatStr, options).value.replace(/\"+/, "")
}