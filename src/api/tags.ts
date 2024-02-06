import { defHttp } from '@/utils/http/axios';

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
  unbindTag2Draft = '/unbindTag2Draft'
}

export const getTagList = (data?: any) => {
  return defHttp.get<any>({ url: Api.getTagList, params: data });
}

export const getDraftTagList = (data?: any) => {
  return defHttp.get<any>({ url: Api.getDraftTagList, params: data });
}

export const getMenuTagList = (data?: any) => {
  return defHttp.get<any>({ url: Api.getMenuTagList, params: data });
}

export const createTag = (data: any) => {
  return defHttp.post<any>({ url: Api.createTag, data });
}

export const deleteTag = (data: any) => {
  return defHttp.post<any>({ url: Api.deleteTag, data });
}

export const updateTag = (data: any) => {
  return defHttp.post<any>({ url: Api.updateTag, data });
}

export const bindTag2Menu = (data: any) => {
  return defHttp.post<any>({ url: Api.bindTag2Menu, data });
}

export const unbindTag2Menu = (data: any) => {
  return defHttp.post<any>({ url: Api.unbindTag2Menu, data });
}

export const bindTag2Draft = (data: any) => {
  return defHttp.post<any>({ url: Api.bindTag2Draft, data });
}

export const unbindTag2Draft = (data: any) => {
  return defHttp.post<any>({ url: Api.unbindTag2Draft, data });
}