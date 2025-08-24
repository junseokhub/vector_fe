export interface ContentResponseDto {
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

export interface ProjectContentsResponseDto {
  id: number;
  key: string;
  name: string;
  prompt: string;
  embedModel: string;
  chatModel: string;
  dimensions: number;
  openAiKey: string;
  createdAt: string;
  updatedAt: string;
  contents: ContentResponseDto[];
}
