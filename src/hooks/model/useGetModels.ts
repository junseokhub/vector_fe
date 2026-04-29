import { useState, useEffect } from 'react';
import client from '@/api/client';
import type { LlmModelInfo, LlmPlatform, ModelType } from '@/types';

interface Params {
  platform?: LlmPlatform;
  type?: ModelType;
}

export function useGetModels({ platform, type }: Params = {}) {
  const [models, setModels] = useState<LlmModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (platform) params.set('platform', platform);
    if (type) params.set('type', type);

    client
      .get<LlmModelInfo[]>(`/api/model/list?${params.toString()}`)
      .then(({ data }) => setModels(data))
      .catch(() => setError('모델 목록을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [platform, type]);

  const chatModels = models.filter((m) => m.type === 'CHAT');
  const embedModels = models.filter((m) => m.type === 'EMBED');

  return { models, chatModels, embedModels, loading, error };
}
