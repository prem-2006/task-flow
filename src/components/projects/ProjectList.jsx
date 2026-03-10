'use client';

import ProjectCard from './ProjectCard';
import { Loader2, FolderKanban } from 'lucide-react';

export default function ProjectList({ projects, isLoading, onEdit, onArchive }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-500" />
        <p>Loading projects...</p>
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)] text-center bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl border-dashed">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <FolderKanban className="w-8 h-8 opacity-50 text-brand-500" />
        </div>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">No projects yet</h3>
        <p className="text-sm max-w-sm">
          Create your first project to start organizing tasks into focused workspaces.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <div 
          key={project._id} 
          className="animate-fade-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProjectCard
            project={project}
            onEdit={() => onEdit(project)}
            onArchive={() => onArchive(project)}
          />
        </div>
      ))}
    </div>
  );
}
