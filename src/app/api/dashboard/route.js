import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const userId = session.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const [
      todayTasks,
      upcomingTasks,
      completedToday,
      totalActive,
      totalCompleted,
      overdueTasks,
      user,
    ] = await Promise.all([
      // Tasks due today
      Task.find({
        userId,
        dueDate: { $gte: today, $lt: tomorrow },
        status: { $ne: 'done' },
      })
        .sort({ priority: -1 })
        .populate('projectId', 'name color')
        .lean(),

      // Upcoming tasks (next 7 days)
      Task.find({
        userId,
        dueDate: { $gte: tomorrow, $lte: weekFromNow },
        status: { $ne: 'done' },
      })
        .sort({ dueDate: 1 })
        .limit(10)
        .populate('projectId', 'name color')
        .lean(),

      // Completed today
      Task.countDocuments({
        userId,
        completedAt: { $gte: today },
      }),

      // Total active tasks
      Task.countDocuments({
        userId,
        status: { $ne: 'done' },
      }),

      // Total completed
      Task.countDocuments({
        userId,
        status: 'done',
      }),

      // Overdue tasks
      Task.countDocuments({
        userId,
        dueDate: { $lt: today },
        status: { $ne: 'done' },
      }),

      // User for streak data
      User.findById(userId).select('completionStreak').lean(),
    ]);

    return NextResponse.json({
      todayTasks,
      upcomingTasks,
      stats: {
        completedToday,
        totalActive,
        totalCompleted,
        overdue: overdueTasks,
      },
      streak: user?.completionStreak || { current: 0, longest: 0 },
    });
  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
