import { useState, useEffect } from 'react';

export interface LearningResource {
  id: string;
  url: string;
  title: string;
  resource_type: 'video' | 'article' | 'course' | 'docs' | 'other';
  date_completed: string;
  time_spent_minutes: number;
  notes?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'escape-tutorial-hell-resources';

export function useLocalStorageResources() {
  const [resources, setResources] = useState<LearningResource[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever resources change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  }, [resources]);

  const addResource = (resource: Omit<LearningResource, 'id' | 'created_at' | 'updated_at'>) => {
    const newResource: LearningResource = {
      ...resource,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setResources(prev => [...prev, newResource]);
  };

  const updateResource = (id: string, updates: Partial<LearningResource>) => {
    setResources(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, ...updates, updated_at: new Date().toISOString() }
          : r
      )
    );
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const getResourcesByDate = (dateStr: string): LearningResource[] => {
    return resources.filter(r => r.date_completed === dateStr);
  };

  return {
    resources,
    addResource,
    updateResource,
    deleteResource,
    getResourcesByDate,
  };
}
