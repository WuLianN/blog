import { defHttp } from '@/utils/http/axios';
import type { Query } from './model/baseModel'
import type { GetUploadFileList } from './model/adminModel'

enum Api {
  getUploadFileList = '/getUploadFileList',
  deleteUploadFiles = '/deleteUploadFiles'
}

export const getUploadFileList = (query: Query) => {
  return defHttp.get<GetUploadFileList[]>({ url: Api.getUploadFileList, params: query })
}

export const deleteUploadFiles = (ids: Array<number>) => {
  return defHttp.post<any>({ url: Api.deleteUploadFiles, data: { ids } })
}