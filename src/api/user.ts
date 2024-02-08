import { defHttp } from '@/utils/http/axios';
import { loginResultModel } from './model/userModel';

enum Api {
  login = '/login',
  register =  '/register'
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