import { defHttp } from '@/utils/http/axios';

enum Api {
  getTagList = '/getTagList',
  createTag = '/createTag',
  deleteTag = '/deleteTag',
  updateTag = '/updateTag',
  bindTag2Menu = '/bindTag2Menu',
}

export const getTagList = (data?: any) => {
  return defHttp.get<any>({ url: Api.getTagList, params: data });
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