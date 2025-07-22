import type { RecommendDraft } from './model/draftsModel'
import { defHttp } from '@/utils/http/axios'

enum Api {
  createDraft = '/createDraft',
  saveDraft = '/saveDraft',
  getDraft = '/getDraft',
  getUserDraft = '/getUserDraft',
  getDraftList = '/getDraftList',
  deleteDraft = '/deleteDraft',
  publishDraft = '/publishDraft',
  searchDrafts = '/searchDrafts',
}

export function createDraft() {
  return defHttp.get<any>({ url: Api.createDraft })
}

export function saveDraft(data: any) {
  return defHttp.post<any>({ url: Api.saveDraft, data })
}

export function getDraft(data: any) {
  return defHttp.get<any>({ url: Api.getDraft, params: data })
}

export function getUserDraft(data: any) {
  return defHttp.get<any>({ url: Api.getUserDraft, params: data })
}

export function getDraftList(data: any) {
  return defHttp.get<any>({ url: Api.getDraftList, params: { status: data.status, page: data.page, page_size: data.pageSize, title: data.title, tag_ids: data.tagIds.toString() } })
}

export function deleteDraft(id: number) {
  return defHttp.post<any>({ url: Api.deleteDraft, data: { id } })
}

export function publishDraft(id: number) {
  return defHttp.post<any>({ url: Api.publishDraft, data: { id } })
}

export function searchDrafts(data: any) {
  return defHttp.get<RecommendDraft[]>({ url: Api.searchDrafts, params: { keyword: data.keyword, page: data.page, page_size: data.pageSize, user_id: data.userId } })
}
