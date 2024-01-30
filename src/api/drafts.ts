import { defHttp } from '@/utils/http/axios';

enum Api {
  createDraft = '/createDraft',
  saveDraft = '/saveDraft',
  getDraft = '/getDraft',
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