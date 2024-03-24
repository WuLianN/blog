import { defHttp } from '@/utils/http/axios'

enum Api {
  getTagList = '/getTagList',
  getDraftTagList = '/getDraftTagList',
  getMenuTagList = '/getMenuTagList',
  createTag = '/createTag',
  deleteTag = '/deleteTag',
  updateTag = '/updateTag',
  bindTag2Menu = '/bindTag2Menu',
  unbindTag2Menu = '/unbindTag2Menu',
  bindTag2Draft = '/bindTag2Draft',
  unbindTag2Draft = '/unbindTag2Draft',
}

export function getTagList(data?: any) {
  return defHttp.get<any>({ url: Api.getTagList, params: data })
}

export function getDraftTagList(data?: any) {
  return defHttp.get<any>({ url: Api.getDraftTagList, params: data })
}

export function getMenuTagList(data?: any) {
  return defHttp.get<any>({ url: Api.getMenuTagList, params: data })
}

export function createTag(data: any) {
  return defHttp.post<any>({ url: Api.createTag, data })
}

export function deleteTag(data: any) {
  return defHttp.post<any>({ url: Api.deleteTag, data })
}

export function updateTag(data: any) {
  return defHttp.post<any>({ url: Api.updateTag, data })
}

export function bindTag2Menu(data: any) {
  return defHttp.post<any>({ url: Api.bindTag2Menu, data })
}

export function unbindTag2Menu(data: any) {
  return defHttp.post<any>({ url: Api.unbindTag2Menu, data })
}

export function bindTag2Draft(data: any) {
  return defHttp.post<any>({ url: Api.bindTag2Draft, data })
}

export function unbindTag2Draft(data: any) {
  return defHttp.post<any>({ url: Api.unbindTag2Draft, data })
}
