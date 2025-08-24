export interface LoginParams {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  id: number
  email: string
  username: string
  role: string
}

export interface User {
  id: number
  email: string
  username: string
  role: string
}