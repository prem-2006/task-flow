'use client';

import { useState, useEffect } from 'react';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/utils/constants';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SubtaskList from './SubtaskList';
import { Calendar, Tag, Clock, Sparkles } from 'lucide-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';

export default function TaskForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'todo',
    priority: initialData.priority || 'medium',
    dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    estimatedMinutes: initialData.estimatedMinutes || '',
    tags: initialData.tags ? initialData.tags.join(', ') : '',
    subtasks: initialData.subtasks || [],
    projectId: initialData.projectId?._id || initialData.projectId || '',
  });

  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);

  // Fetch projects for the dropdown
  const { data: projectsData } = useSWR('/api/projects');
  const projects = projectsData?.projects || [];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleGenerateSubtasks() {
    if (!formData.title) {
      toast.error('Please enter a title first');
      return;
    }
    
    setIsGeneratingSubtasks(true);
    try {
      const res = await fetch('/api/ai/suggest-subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, description: formData.description }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (data.subtasks && data.subtasks.length > 0) {
        setFormData(prev => ({
          ...prev,
          subtasks: [...prev.subtasks, ...data.subtasks.map(st => ({ title: st.title, done: false }))]
        }));
        toast.success('Generated subtasks!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to generate subtasks');
    } finally {
      setIsGeneratingSubtasks(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      // Convert tags string to array
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      // Convert minutes to number
      estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes, 10) : null,
      // Format date or null
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      projectId: formData.projectId || null,
    };

    onSubmit(submissionData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title & Description */}
      <div className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          required
          autoFocus
        />
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text-primary)]">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add some details..."
            rows={3}
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border)] focus-ring outline-none resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border)] focus-ring outline-none"
          >
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border)] focus-ring outline-none"
          >
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {/* Project */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Project</label>
          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border)] focus-ring outline-none"
          >
            <option value="">No Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Due Date</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border)] focus-ring outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estimated Time */}
        <Input
          label="Est. Time (minutes)"
          name="estimatedMinutes"
          type="number"
          min="1"
          icon={Clock}
          placeholder="e.g., 60"
          value={formData.estimatedMinutes}
          onChange={handleChange}
        />

        {/* Tags */}
        <Input
          label="Tags (comma separated)"
          name="tags"
          icon={Tag}
          placeholder="work, urgent, review"
          value={formData.tags}
          onChange={handleChange}
        />
      </div>

      {/* Subtasks */}
      <div className="space-y-3 pt-2 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-[var(--text-primary)]">Subtasks</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleGenerateSubtasks}
            loading={isGeneratingSubtasks}
            className="text-brand-500 hover:text-brand-600"
          >
            {!isGeneratingSubtasks && <Sparkles className="w-4 h-4 text-brand-500" />}
            Auto-generate
          </Button>
        </div>
        
        <SubtaskList
          subtasks={formData.subtasks}
          onChange={(subtasks) => setFormData(prev => ({ ...prev, subtasks }))}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData._id ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
