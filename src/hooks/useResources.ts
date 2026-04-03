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

  // Load from localStorage (fallback)
  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setResources(JSON.parse(saved));
  }, []);

  const saveToLocalStorage = useCallback((newResources: LearningResource[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newResources));
    setResources(newResources);
  }, []);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Add resource
  const addResource = async (data: Omit<LearningResource, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const newResource = await resourcesApi.create({
        ...data,
        date_completed: data.date_completed,
        is_completed: data.is_completed ?? true,
      });

      const updated = [...resources, newResource];
      saveToLocalStorage(updated);
      toast.success("Resource added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save to backend. Saved locally.");
      // Fallback to localStorage
      const fallbackResource = {
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
      toast.error("Failed to update on backend. Updated locally.");
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
      toast.error("Failed to delete from backend. Deleted locally.");
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
