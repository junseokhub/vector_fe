export interface Project {
  id: number
  name: string
  key: string
  prompt?: string
  embedModel?: string
  chatModel?: string
  openAiKey?: string
  dimensions: number
  createdUserId: number
  updatedUserId: number
  createdAt: string
  updatedAt: string
  mine?: string
}

export interface GetProjectParam {
  userId: number
}