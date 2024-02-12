import { defHttp } from '@/utils/http/axios';
import { LoginResult, LoginParams } from './model/userModel';

enum Api {
  login = '/login',
  register = '/register',
  getUserInfo = '/getUserInfo',
  updateUserInfo = '/updateUserInfo',
  changePassword = '/changePassword'
}

/**
 * @description: 登录
 */
export const login = (data: LoginParams) => {
  return defHttp.post<LoginResult>({ url: Api.login, data });
};

export const register = (data: LoginParams) => {
  return defHttp.post<LoginResult>({ url: Api.register, data });
}

export const getUserInfo = (id?: number | null) => {
  return defHttp.get<any>({ url: Api.getUserInfo, data: { id } })
}

export const updateUserInfo = (data: any) => {
  return defHttp.post<any>({ url: Api.updateUserInfo, data })
}

export const changePassword = (data: any) => {
  return defHttp.post<any>({ url: Api.changePassword, data })
}