export interface ProjectUpdateParams {
  name: string;
  openAiKey: string;
  prompt: string;
  embedModel: string;
  chatModel: string;
  dimensions: number;
  updatedUserId: number;
}

export interface ProjectUpdateResponse {
  key: string;
  name: string;
  openAiKey: string;
  prompt: string;
  embedModel: string;
  chatModel: string;
  dimensions: number;
  updatedUserId: number;
}