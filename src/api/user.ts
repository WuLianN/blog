import type { LoginParams, LoginResult } from './model/userModel'
import { defHttp } from '@/utils/http/axios'

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
  getUserSetting = '/getUserSetting',
  saveBindedUserSort = '/saveBindedUserSort',
}

/**
 * @description: 登录
 */
export function login(data: LoginParams) {
  return defHttp.post<LoginResult>({ url: Api.login, data })
}

export function register(data: LoginParams) {
  return defHttp.post<LoginResult>({ url: Api.register, data })
}

export function getUserInfo(id?: number | null) {
  return defHttp.get<any>({ url: Api.getUserInfo, params: { id } })
}

export function updateUserInfo(data: any) {
  return defHttp.post<any>({ url: Api.updateUserInfo, data })
}

export function changePassword(data: any) {
  return defHttp.post<any>({ url: Api.changePassword, data })
}

export function bingUser(data: any) {
  return defHttp.post<any>({ url: Api.bingUser, data })
}

export function unbindUser(id: number) {
  return defHttp.post<any>({ url: Api.unbindUser, data: { id } })
}

export function getBindedUserList(id: number) {
  return defHttp.get<any>({ url: Api.getBindedUserList, params: { user_id: id } })
}

export function changeAccount(id: number) {
  return defHttp.post<any>({ url: Api.changeAccount, data: { id } })
}

export function updateUserSetting(data: any) {
  return defHttp.post<any>({ url: Api.updateUserSetting, data })
}

export function getUserSetting(id?: number | null) {
  return defHttp.get<any>({ url: Api.getUserSetting, params: { user_id: id } })
}

export function saveBindedUserSort(data: any) {
  return defHttp.post<any>({ url: Api.saveBindedUserSort, data })
}
