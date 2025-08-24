export interface SignUpParams {
  username: string
  email: string
  password: string
}

export interface User {
  id: number
  email: string
  username: string
  role: string
}


export interface UserResponse {
  id: number
  email: string
  username: string
  role: string
  loginAt?: string
  createdAt?: string
  updatedAt?: string
}