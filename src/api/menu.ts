import type { MenuListResultModel } from './model/menuModel'
import { defHttp } from '@/utils/http/axios'

enum Api {
  GetMenuList = '/getMenuList',
  AddMenuItem = '/addMenuItem',
  DeleteMenuItem = '/deleteMenuItem',
  UpdateMenuItem = '/updateMenuItem',
}

/**
 * @description: 获取菜单
 */

export function getMenuList(id?: number | null) {
  return defHttp.get<MenuListResultModel>({ url: Api.GetMenuList, params: { user_id: id } })
}

export function addMenuItem(data: any) {
  return defHttp.post<any>({ url: Api.AddMenuItem, data })
}

export function deleteMenuItem(id: number) {
  return defHttp.post<any>({ url: Api.DeleteMenuItem, params: { id } })
}

export function updateMenuItem(data: any) {
  return defHttp.post<any>({ url: Api.UpdateMenuItem, data })
}
