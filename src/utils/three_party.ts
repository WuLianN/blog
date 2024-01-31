import matter from 'gray-matter'
export function getExcerpt(value: string): string {
  const summaryLength = 200
  const { content } = matter(value);
  const sanitizedContent = content.trim().replaceAll(/#+\s+(.+)/g, '')
  const excerpt = sanitizedContent.trim().slice(0, summaryLength) + ' ...'

  return excerpt
}