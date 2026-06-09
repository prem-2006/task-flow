import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import Project from '@/models/Project';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const userId = session.user.id;

    // Get stats
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ userId, status: 'in-progress' });
    const upcomingTasks = await Task.countDocuments({ 
      userId, 
      dueDate: { $gte: new Date() },
      status: { $ne: 'completed' }
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get recent activity (last 5 tasks)
    const recentTasks = await Task.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('projectId', 'name color');

    const activityMap = recentTasks.map(t => ({
      id: t._id,
      type: t.status === 'completed' ? 'task_completed' : 'task_created',
      title: t.title,
      project: t.projectId ? t.projectId.name : 'Personal',
      timestamp: t.updatedAt
    }));

    // Get upcoming deadlines
    const upcomingDeadlines = await Task.find({
      userId,
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      status: { $ne: 'completed' }
    }).sort({ dueDate: 1 }).limit(4);

    return NextResponse.json({
      stats: {
        totalTasks,
        completionRate,
        upcomingDeadlines: upcomingTasks,
        inProgress: inProgressTasks
      },
      recentActivity: activityMap,
      upcomingTasks: upcomingDeadlines
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
