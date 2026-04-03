import { useState, useEffect, useCallback } from 'react';
import { resourcesApi, CreateResourceData } from '@/lib/api';
import { toast } from 'sonner';

export interface LearningResource {
  id: string | number;
  url: string;
  title: string;
  resource_type: 'video' | 'article' | 'course' | 'docs' | 'other';
  date_completed: string;
  time_spent_minutes: number;
  notes?: string;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useResources() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(false);

  const STORAGE_KEY = 'escape-tutorial-hell-resources';

  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setResources(JSON.parse(saved));
  }, []);

  const saveToLocalStorage = useCallback((newResources: LearningResource[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newResources));
    setResources(newResources);
  }, []);

  // Load initial data
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Add resource - try backend first
  const addResource = async (data: Omit<LearningResource, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const newResource = await resourcesApi.create({
        url: data.url,
        title: data.title,
        resource_type: data.resource_type,
        date_completed: data.date_completed,
        time_spent_minutes: data.time_spent_minutes,
        notes: data.notes,
        is_completed: data.is_completed,
      });

      const updated = [...resources, newResource];
      saveToLocalStorage(updated);
      toast.success("Resource saved to backend");
    } catch (error) {
      console.error("Backend save failed, using localStorage fallback", error);
      toast.error("Backend unavailable. Saved locally.");

      const fallbackResource: LearningResource = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [...resources, fallbackResource];
      saveToLocalStorage(updated);
    } finally {
      setLoading(false);
    }
  };

  // Update resource
  const updateResource = async (id: string | number, updates: Partial<LearningResource>) => {
    try {
      setLoading(true);
      await resourcesApi.update(id, updates);

      const updated = resources.map(r =>
        r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
      );
      saveToLocalStorage(updated);
      toast.success("Resource updated");
    } catch (error) {
      console.error(error);
      toast.error("Backend update failed. Updated locally.");
      const updated = resources.map(r =>
        r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
      );
      saveToLocalStorage(updated);
    } finally {
      setLoading(false);
    }
  };

  // Delete resource
  const deleteResource = async (id: string | number) => {
    try {
      setLoading(true);
      await resourcesApi.delete(id);

      const updated = resources.filter(r => r.id !== id);
      saveToLocalStorage(updated);
      toast.success("Resource deleted");
    } catch (error) {
      console.error(error);
      toast.error("Backend delete failed. Deleted locally.");
      const updated = resources.filter(r => r.id !== id);
      saveToLocalStorage(updated);
    } finally {
      setLoading(false);
    }
  };

  const getResourcesByDate = (dateStr: string): LearningResource[] => {
    return resources.filter(r => r.date_completed === dateStr);
  };

  return {
    resources,
    loading,
    addResource,
    updateResource,
    deleteResource,
    getResourcesByDate,
  };
}
