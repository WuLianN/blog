export interface LoginResult {
  id: number
  token: string
  user_name: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  user_name: string
  avatar: string
}