import { defHttp } from '@/utils/http/axios';

enum Api {
  getRecommendList = '/getRecommendList'
}

export const getRecommendList = (data: any) => {
  return defHttp.get<any>({ url: Api.getRecommendList,  params: { category_id: data.categoryId, user_id: data.userId, page: data.page, page_size: data.pageSize } });
};