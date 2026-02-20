'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTask, updateTask } from '@/hooks/useTasks';
import TaskDetail from '@/components/tasks/TaskDetail';
import TaskForm from '@/components/tasks/TaskForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function SingleTaskPage({ params }) {
  const router = useRouter();
  const { task, isLoading, error, mutateTask } = useTask(params.id);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error('Task not found');
      router.push('/tasks');
    }
  }, [error, router]);

  async function handleUpdate(data) {
    try {
      await updateTask(task._id, data);
      toast.success('Task updated');
      setIsEditing(false);
      mutateTask();
    } catch (err) {
      // Error handled in hook
    }
  }

  if (isLoading || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[var(--text-muted)]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-500" />
        <p>Loading task...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/tasks')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </Button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
        {isEditing ? (
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Edit Task</h2>
            <TaskForm
              initialData={task}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <TaskDetail
            task={task}
            onEdit={() => setIsEditing(true)}
            onClose={() => router.push('/tasks')}
          />
        )}
      </div>
    </div>
  );
}
