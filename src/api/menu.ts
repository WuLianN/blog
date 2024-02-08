import { defHttp } from '@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';
import type { LocationQueryValue } from 'vue-router'

enum Api {
  GetMenuList = '/getMenuList',
  AddMenuItem = '/addMenuItem',
  DeleteMenuItem = '/deleteMenuItem',
  UpdateMenuItem = '/updateMenuItem'
}

/**
 * @description: 获取菜单
 */

export const getMenuList = (id: LocationQueryValue | LocationQueryValue[]) => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList, params: { user_id: id } });
};

export const addMenuItem = (data: any) => {
  return defHttp.post<any>({ url: Api.AddMenuItem, data });
};

export const deleteMenuItem = (id: number) => {
  return defHttp.post<any>({ url: Api.DeleteMenuItem, params: { id } });
};

export const updateMenuItem = (data: any) => {
  return defHttp.post<any>({ url: Api.UpdateMenuItem, data });
};