import { defHttp } from '@/utils/http/axios';
import { loginResultModel } from './model/userModel';

enum Api {
  login = '/login',
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
