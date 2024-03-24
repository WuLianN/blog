import type { Query } from './model/baseModel'
import type { GetUploadFileList } from './model/adminModel'
import { defHttp } from '@/utils/http/axios'

enum Api {
  getUploadFileList = '/getUploadFileList',
  deleteUploadFiles = '/deleteUploadFiles',
}

export function getUploadFileList(query: Query) {
  return defHttp.get<GetUploadFileList[]>({ url: Api.getUploadFileList, params: query })
}

export function deleteUploadFiles(ids: Array<number>) {
  return defHttp.post<any>({ url: Api.deleteUploadFiles, data: { ids } })
}
