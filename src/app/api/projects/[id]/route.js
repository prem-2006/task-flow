import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Task from '@/models/Task';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const project = await Project.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const tasks = await Task.find({
      projectId: params.id,
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ project, tasks });
  } catch (error) {
    console.error('GET /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    await dbConnect();
    const project = await Project.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $set: body },
      { new: true }
    );

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const project = await Project.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $set: { archived: true } },
      { new: true }
    );

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Unlink tasks from project
    await Task.updateMany(
      { projectId: params.id, userId: session.user.id },
      { $set: { projectId: null } }
    );

    return NextResponse.json({ message: 'Project archived' });
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
