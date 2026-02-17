'use client';

import { useState } from 'react';
import { useProjects, createProject, updateProject, archiveProject } from '@/hooks/useProjects';
import ProjectList from '@/components/projects/ProjectList';
import ProjectForm from '@/components/projects/ProjectForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const { projects, isLoading, mutateProjects } = useProjects();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  async function handleFormSubmit(data) {
    try {
      if (projectToEdit) {
        await updateProject(projectToEdit._id, data);
        toast.success('Project updated');
      } else {
        await createProject(data);
        toast.success('Project created');
      }
      setIsFormOpen(false);
      setProjectToEdit(null);
    } catch (error) {
      // Error handled in hook
    }
  }

  function handleEdit(project) {
    setProjectToEdit(project);
    setIsFormOpen(true);
  }

  async function handleArchive(project) {
    if (confirm(`Are you sure you want to archive "${project.name}"? All related tasks will be unlinked.`)) {
      await archiveProject(project._id);
    }
  }

  function closeForm() {
    setIsFormOpen(false);
    setProjectToEdit(null);
  }

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-[var(--text-secondary)] text-sm">Organize tasks into distinct workspaces</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full md:w-auto">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      <div className="flex-1">
        <ProjectList
          projects={projects}
          isLoading={isLoading}
          onEdit={handleEdit}
          onArchive={handleArchive}
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={projectToEdit ? 'Edit Project' : 'Create Project'}
      >
        <ProjectForm
          initialData={projectToEdit || {}}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}
