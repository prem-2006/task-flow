'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProject, updateProject, archiveProject } from '@/hooks/useProjects';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import TaskDetail from '@/components/tasks/TaskDetail';
import ProjectForm from '@/components/projects/ProjectForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Loader2, ArrowLeft, Plus, Settings, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { createTask, updateTask } from '@/hooks/useTasks';

export default function SingleProjectPage({ params }) {
  const router = useRouter();
  const { project, tasks, isLoading, error, mutateProject } = useProject(params.id);

  // Modals
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[var(--text-muted)]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-500" />
        <p>Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Project Not Found</h2>
        <p className="text-[var(--text-muted)] mb-6">This project might have been archived or deleted.</p>
        <Button onClick={() => router.push('/projects')}>Go to Projects</Button>
      </div>
    );
  }

  // Calculate project stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  async function handleProjectUpdate(data) {
    try {
      await updateProject(project._id, data);
      toast.success('Project updated');
      setIsProjectFormOpen(false);
    } catch (err) {}
  }

  async function handleProjectArchive() {
    if (confirm(`Are you sure you want to archive "${project.name}"?`)) {
      try {
        await archiveProject(project._id);
        router.push('/projects');
      } catch (err) {}
    }
  }

  function handleTaskClick(task) {
    setSelectedTask(task);
    setIsDetailOpen(true);
  }

  async function handleTaskFormSubmit(data) {
    try {
      // Force the project ID to the current project
      const submissionData = { ...data, projectId: project._id };
      
      if (taskToEdit) {
        await updateTask(taskToEdit._id, submissionData);
        toast.success('Task updated');
      } else {
        await createTask(submissionData);
        toast.success('Task created');
      }
      setIsTaskFormOpen(false);
      setTaskToEdit(null);
      mutateProject();
    } catch (err) {}
  }

  return (
    <div className="h-full flex flex-col pb-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/projects')}>
          <ArrowLeft className="w-4 h-4" />
          Projects
        </Button>
      </div>

      {/* Project Header Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1.5" 
          style={{ backgroundColor: project.color }} 
        />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{project.name}</h1>
            {project.description && (
              <p className="text-[var(--text-secondary)] max-w-2xl">{project.description}</p>
            )}
            
            {/* Progress */}
            <div className="mt-6 max-w-md">
              <div className="flex items-center justify-between text-sm text-[var(--text-muted)] mb-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckSquare className="w-4 h-4" />
                  {completedTasks} / {totalTasks} tasks completed
                </span>
                <span className="font-bold text-[var(--text-primary)]">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: project.color
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setIsProjectFormOpen(true)}>
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button onClick={() => setIsTaskFormOpen(true)} style={{ backgroundColor: project.color, borderColor: project.color }}>
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white">Add Task</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Project Tasks */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Tasks</h2>
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* Project Settings Modal */}
      <Modal
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        title="Project Settings"
      >
        <ProjectForm
          initialData={project}
          onSubmit={handleProjectUpdate}
          onCancel={() => setIsProjectFormOpen(false)}
        />
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <h4 className="text-sm font-semibold text-red-500 mb-2">Danger Zone</h4>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Archiving a project will hide it from your active list and unlink all associated tasks.
          </p>
          <Button variant="secondary" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200" onClick={handleProjectArchive}>
            Archive Project
          </Button>
        </div>
      </Modal>

      {/* Task Form Modal */}
      <Modal
        isOpen={isTaskFormOpen}
        onClose={() => { setIsTaskFormOpen(false); setTaskToEdit(null); }}
        title={taskToEdit ? 'Edit Task' : 'Create Task'}
        size="lg"
      >
        <TaskForm
          initialData={taskToEdit || { projectId: project._id }}
          onSubmit={handleTaskFormSubmit}
          onCancel={() => { setIsTaskFormOpen(false); setTaskToEdit(null); }}
        />
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        size="lg"
        className="overflow-hidden"
      >
        <div className="h-[80vh] flex flex-col -m-6">
          <TaskDetail
            task={selectedTask}
            onEdit={() => {
              setTaskToEdit(selectedTask);
              setIsDetailOpen(false);
              setIsTaskFormOpen(true);
            }}
            onClose={() => setIsDetailOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}
