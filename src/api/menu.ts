import { defHttp } from '@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';
import type { LocationQueryValue } from 'vue-router'

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: 获取菜单
 */

export const getMenuList = (id: LocationQueryValue | LocationQueryValue[]) => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList, params: { user_id: id } });
};
