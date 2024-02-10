import { defHttp } from '@/utils/http/axios';
import { loginResultModel } from './model/userModel';

enum Api {
  login = '/login',
  register = '/register',
  getUserInfo = '/getUserInfo'
}

interface loginData {
  username: string;
  password: string;
}

/**
 * @description: 登录
 */
export const login = (data: loginData) => {
  return defHttp.post<loginResultModel>({ url: Api.login, data });
};

export const register = (data: loginData) => {
  return defHttp.post<loginResultModel>({ url: Api.register, data });
}

export const getUserInfo = (id: string | number) => {
  return defHttp.get<any>({ url: Api.getUserInfo, data: { id } })
}