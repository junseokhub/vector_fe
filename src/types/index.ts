// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthState {
  accessToken: string;
  id: number;
  email: string;
}

export interface LoginParams { 
  email: string;
  password: string
}

export interface LoginResponse {
  accessToken: string;
  id: number; 
  email: string; 
  username: string; 
  role: string
 }

export interface SignUpParams {
   username: string; 
   email: string; 
   password: string 
}

export interface UserResponse {
   id: number; 
   email: string; 
   username: string; 
   role: string; 
   loginAt?: string; 
   createdAt?: string; 
   updatedAt?: string 
}


export interface Project {
  id: number; name: string; key: string;
  prompt?: string; embedModel?: string; chatModel?: string; openAiKey?: string;
  dimensions: number; createdUserId: number; updatedUserId: number;
  createdAt: string; updatedAt: string; mine?: string;
}

export interface CreateProjectParams { 
  name: string; 
  createdUserId: number; 
  dimensions: number 
}

export interface ProjectUpdateParams {
  name: string; openAiKey: string; prompt: string;
  embedModel: string; chatModel: string; dimensions: number; updatedUserId: number;
}
export interface ProjectUpdateResponse extends ProjectUpdateParams { key: string }

export interface ProjectContentsDto {
  contents: ContentDto[];
}

// ─── Content ─────────────────────────────────────────────────────────────────
export interface ContentDto {
  id: number; key: string; title: string; answer: string;
  projectId: number; createdUserId: number; updatedUserId: number;
  createdAt: string; updatedAt: string;
}

export interface ContentCreateParams {
   title: string; 
   answer?: string; 
   projectKey: string 
}

export interface ContentUpdateParams {
   title: string; 
   answer: string; 
   updatedUserId: number 
  }

// ─── Chat ─────────────────────────────────────────────────────────────────────
export interface ChatMessage {
   role: "user" | "assistant"; 
   text: string 
}