import useSWR, { mutate } from 'swr';
import toast from 'react-hot-toast';

export function useProjects() {
  const { data, error, isLoading } = useSWR('/api/projects');

  return {
    projects: data?.projects || [],
    isLoading,
    error,
    mutateProjects: () => mutate('/api/projects'),
  };
}

export function useProject(projectId) {
  const url = projectId ? `/api/projects/${projectId}` : null;
  const { data, error, isLoading } = useSWR(url);

  return {
    project: data?.project || null,
    tasks: data?.tasks || [],
    isLoading,
    error,
    mutateProject: () => mutate(url),
  };
}

export async function createProject(projectData) {
  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create project');
    }
    
    const data = await res.json();
    mutate('/api/projects');
    return data.project;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
}

export async function updateProject(projectId, updates) {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update project');
    }
    
    const data = await res.json();
    mutate(`/api/projects/${projectId}`, (current) => ({ ...current, project: data.project }), false);
    mutate('/api/projects');
    return data.project;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
}

export async function archiveProject(projectId) {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete project');
    }
    
    mutate(`/api/projects/${projectId}`, null, false);
    mutate('/api/projects');
    mutate('/api/dashboard'); // Project counts might affect dashboard
    toast.success('Project archived');
    return true;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
}
