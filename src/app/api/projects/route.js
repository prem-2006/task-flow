import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Task from '@/models/Task';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const projects = await Project.find({
      userId: session.user.id,
      archived: false,
    }).sort({ updatedAt: -1 }).lean();

    // Get task counts per project
    const projectIds = projects.map((p) => p._id);
    const taskCounts = await Task.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      {
        $group: {
          _id: '$projectId',
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
        },
      },
    ]);

    const countMap = {};
    taskCounts.forEach((tc) => {
      countMap[tc._id.toString()] = { total: tc.total, completed: tc.completed };
    });

    const projectsWithCounts = projects.map((p) => ({
      ...p,
      taskCount: countMap[p._id.toString()]?.total || 0,
      completedCount: countMap[p._id.toString()]?.completed || 0,
    }));

    return NextResponse.json({ projects: projectsWithCounts });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await request.json();

    const project = await Project.create({
      userId: session.user.id,
      name: body.name,
      description: body.description || '',
      color: body.color || '#4F46E5',
      icon: body.icon || 'folder',
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
