import { Project } from "../interface";

export interface ContentResponseDto {
  id: number;
  text: string; // Content.java에 어떤 필드가 있을지 모르니 일단 가장 일반적인 'text'로 가정
}

export interface ProjectContentsResponseDto {
  id: number;
  name: string;
  key: string;
  prompt: string;
  embedModel: string;
  chatModel: string;
  openAiKey: string;
  dimensions: number;
  createdAt: string;
  updatedAt: string;
  contents: ContentResponseDto[];
}

export type ResponseProjectList = Project[];

export interface GetProjectParam {
  userId: number
}

export interface CreateProjectParams {
  name: string
  dimensions: number
  createdUserId: number
}