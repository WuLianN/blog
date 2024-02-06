import { defHttp } from '@/utils/http/axios';

enum Api {
  createDraft = '/createDraft',
  saveDraft = '/saveDraft',
  getDraft = '/getDraft',
  getDraftList = '/getDraftList',
  deleteDraft = '/deleteDraft'
}

export const createDraft = () => {
  return defHttp.get<any>({ url: Api.createDraft });
};

export const saveDraft = (data: any) => {
  return defHttp.post<any>({ url: Api.saveDraft, data });
};

export const getDraft = (data: any) => {
  return defHttp.get<any>({ url: Api.getDraft, params: data });
};

export const getDraftList = (data: any) => {
  return defHttp.get<any>({ url: Api.getDraftList, params: { status: data.status, page: data.page, page_size: data.pageSize } });
};

export const deleteDraft = (id: number) => {
  return defHttp.post<any>({ url: Api.deleteDraft, data: { id } });
};