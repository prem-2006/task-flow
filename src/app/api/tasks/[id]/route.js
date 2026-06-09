import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import Project from '@/models/Project';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const task = await Task.findOne({ _id: params.id, userId: session.user.id });

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error('GET /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    await dbConnect();
    const oldTask = await Task.findOne({ _id: params.id, userId: session.user.id });
    if (!oldTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const updatedTask = await Task.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $set: body },
      { new: true }
    );

    // Update project completed count if status changed
    if (oldTask.status !== updatedTask.status && updatedTask.projectId) {
      if (updatedTask.status === 'completed') {
        await Project.findByIdAndUpdate(updatedTask.projectId, { $inc: { completedCount: 1 } });
      } else if (oldTask.status === 'completed') {
        await Project.findByIdAndUpdate(updatedTask.projectId, { $inc: { completedCount: -1 } });
      }
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const task = await Task.findOneAndDelete({ _id: params.id, userId: session.user.id });

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    // Decrement counts if part of a project
    if (task.projectId) {
      const updateData = { $inc: { taskCount: -1 } };
      if (task.status === 'completed') {
        updateData.$inc.completedCount = -1;
      }
      await Project.findByIdAndUpdate(task.projectId, updateData);
    }

    return NextResponse.json({ message: 'Task deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
