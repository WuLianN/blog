import { defHttp } from '@/utils/http/axios'

enum Api {
  getRecommendList = '/getRecommendList',
}

export function getRecommendList(data: any) {
  return defHttp.get<any>({ url: Api.getRecommendList, params: { tag_ids: data.tagIds, user_id: data.userId, page: data.page, page_size: data.pageSize } }, { isLoading: true })
}
