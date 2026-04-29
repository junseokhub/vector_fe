// ─── LLM ─────────────────────────────────────────────────────────────────────
export type LlmPlatform = 'OPENAI' | 'OLLAMA';
export type ModelType = 'CHAT' | 'EMBED';

export interface LlmModelInfo {
  platform: LlmPlatform;
  type: ModelType;
  name: string;
  dimensions: number | null;
  flexDimensions: boolean;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export type AuthState = {
  isAuthenticated: boolean;
  id: number | null;
};

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface SignUpParams {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  role: string;
  loginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────
export interface Project {
  id: number;
  name: string;
  key: string;
  prompt?: string;
  embedModel?: string;
  chatModel?: string;
  apiKey?: string;
  llmPlatform?: LlmPlatform;
  dimensions: number;
  createdUserId: number;
  updatedUserId: number;
  createdAt: string;
  updatedAt: string;
  mine?: string;
}

export interface CreateProjectParams {
  name: string;
  createdUserId: number;
  dimensions: number;
}

export interface ProjectUpdateParams {
  name: string;
  apiKey: string;
  prompt: string;
  embedModel: string;
  chatModel: string;
  dimensions: number;
  llmPlatform: LlmPlatform;
  updatedUserId: number;
}

export interface ProjectUpdateResponse extends ProjectUpdateParams {
  key: string;
}

export interface ProjectContentsDto {
  contents: ContentDto[];
}

// ─── Content ─────────────────────────────────────────────────────────────────
export interface ContentDto {
  id: number;
  key: string;
  title: string;
  answer: string;
  projectId: number;
  createdUserId: number;
  updatedUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentCreateParams {
  title: string;
  answer?: string;
  projectKey: string;
}

export interface ContentUpdateParams {
  title: string;
  answer: string;
  updatedUserId: number;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}
