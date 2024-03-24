import matter from 'gray-matter'
import { useDateFormat } from '@vueuse/core'

export function getExcerpt(value: string): string {
  const summaryLength = 150
  const { content } = matter(value)
  const sanitizedContent = content.trim().replaceAll(/#+\s+(.+)/g, '')
  const ellipsis = sanitizedContent.length > summaryLength ? ' ...' : ''
  const excerpt = sanitizedContent.trim().slice(0, summaryLength) + ellipsis

  return excerpt
}

export function formatDate(date: Date, formatStr = 'YYYY-MM-DD HH:mm:ss', options = {}): string {
  return useDateFormat(date, formatStr, options).value.replace(/\"+/, '')
}
