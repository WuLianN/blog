/**
 * 获取给定文本中的第一个图片链接
 * @param text 给定的文本
 * @returns 返回第一个图片链接，如果没有找到则返回null
 */
export function getFirstImageUrl(text: string): (string | null) {
  // 匹配HTML img标签和带有http或https协议的Markdown风格的图片链接
  const regex = /<img[^>]+src="([^"]+)"|!\[.*?\]\((https?:\/\/[^)]+)\)/i;

  let match;

  // 先尝试匹配HTML img标签
  match = text.match(regex);

  if (match) {
    // 如果找到HTML img标签，则返回src属性值；如果是带有协议的Markdown格式，则返回URL部分
    return match[1] ? match[1] : match[2]; // 匹配两种格式的图片链接
  } else {
    return null; // 没有找到任何图片链接
  }
}