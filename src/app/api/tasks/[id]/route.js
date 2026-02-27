import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import Reminder from '@/models/Reminder';
import { calculateReminderTime } from '@/utils/dates';
import { updateEventInCalendar, deleteEventFromCalendar, addEventToCalendar } from '@/lib/googleCalendar';

/**
 * GET /api/tasks/[id] — Get single task
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const task = await Task.findOne({
      _id: params.id,
      userId: session.user.id,
    }).populate('projectId', 'name color icon');

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('GET /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/tasks/[id] — Update task
 */
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    const task = await Task.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const previousStatus = task.status;

    // Update fields
    const allowedFields = [
      'title', 'description', 'status', 'priority', 'dueDate',
      'tags', 'subtasks', 'projectId', 'estimatedMinutes',
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        task[field] = body[field];
      }
    });

    // Handle status change to 'done'
    if (body.status === 'done' && previousStatus !== 'done') {
      task.completedAt = new Date();

      // Update completion streak
      const user = await User.findById(session.user.id);
      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastCompleted = user.completionStreak.lastCompletedDate
          ? new Date(user.completionStreak.lastCompletedDate)
          : null;

        if (lastCompleted) {
          lastCompleted.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((today - lastCompleted) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            user.completionStreak.current += 1;
          } else if (diffDays > 1) {
            user.completionStreak.current = 1;
          }
          // diffDays === 0 means already completed today, keep streak
        } else {
          user.completionStreak.current = 1;
        }

        user.completionStreak.lastCompletedDate = today;
        if (user.completionStreak.current > user.completionStreak.longest) {
          user.completionStreak.longest = user.completionStreak.current;
        }
        await user.save();
      }
    } else if (body.status && body.status !== 'done') {
      task.completedAt = null;
    }

    // Update reminder if dueDate changed
    if (body.dueDate !== undefined) {
      await Reminder.deleteMany({ taskId: task._id, sent: false });

      if (body.dueDate) {
        const triggerAt = calculateReminderTime(body.dueDate, task.estimatedMinutes);
        if (triggerAt && triggerAt > new Date()) {
          await Reminder.create({
            userId: session.user.id,
            taskId: task._id,
            type: 'email',
            triggerAt,
          });
        }
      }
    }

    // Sync updates to Google Calendar
    if (task.googleCalendarEventId) {
      if (task.dueDate) {
        await updateEventInCalendar(session.user.id, task.googleCalendarEventId, task);
      } else {
        // If dueDate was removed, remove from calendar
        await deleteEventFromCalendar(session.user.id, task.googleCalendarEventId);
        task.googleCalendarEventId = null;
      }
    } else if (task.dueDate) {
      // If it now has a due date but didn't before
      const eventId = await addEventToCalendar(session.user.id, task);
      if (eventId) task.googleCalendarEventId = eventId;
    }

    await task.save();

    return NextResponse.json({ task });
  } catch (error) {
    console.error('PUT /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/tasks/[id] — Delete task
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const task = await Task.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Clean up reminders
    await Reminder.deleteMany({ taskId: params.id });

    // Remove from Google Calendar
    if (task.googleCalendarEventId) {
      await deleteEventFromCalendar(session.user.id, task.googleCalendarEventId);
    }

    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('DELETE /api/tasks/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
