import { defHttp } from '@/utils/http/axios';
import { LoginResult, LoginParams } from './model/userModel';

enum Api {
  login = '/login',
  register = '/register',
  getUserInfo = '/getUserInfo',
  updateUserInfo = '/updateUserInfo',
  changePassword = '/changePassword',
  bingUser = '/bingUser',
  unbindUser = '/unbindUser',
  getBindedUserList = '/getBindedUserList',
  changeAccount = '/changeAccount',
  updateUserSetting = '/updateUserSetting',
  getUserSetting = '/getUserSetting'
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
  return defHttp.get<any>({ url: Api.getUserInfo, params: { id } })
}

export const updateUserInfo = (data: any) => {
  return defHttp.post<any>({ url: Api.updateUserInfo, data })
}

export const changePassword = (data: any) => {
  return defHttp.post<any>({ url: Api.changePassword, data })
}

export const bingUser = (data: any) => {
  return defHttp.post<any>({ url: Api.bingUser, data })
}

export const unbindUser = (id: number) => {
  return defHttp.post<any>({ url: Api.unbindUser, data: { id } })
}

export const getBindedUserList = (id: number) => {
  return defHttp.get<any>({ url: Api.getBindedUserList, params: { user_id: id } })
}

export const changeAccount = (id: number) => {
  return defHttp.post<any>({ url: Api.changeAccount, data: { id } })
}

export const updateUserSetting = (data: any) => {
  return defHttp.post<any>({ url: Api.updateUserSetting, data })
}

export const getUserSetting = (id?: number | null) => {
  return defHttp.get<any>({ url: Api.getUserSetting, params: { user_id: id } })
}