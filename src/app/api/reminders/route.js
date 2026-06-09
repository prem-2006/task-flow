import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import User from '@/models/User';
import Task from '@/models/Task';
import { sendReminderEmail } from '@/lib/email';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// This endpoint is meant to be called by a cron job (e.g. Vercel Cron)
// We use a simple CRON_SECRET to secure it.
export async function GET(request) {
  try {
    const authHeader = headers().get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Simple protection: only run if the secret matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    // Find unsent reminders where sendAt is in the past
    const pendingReminders = await Reminder.find({
      status: 'pending',
      sendAt: { $lte: new Date() }
    });

    let sentCount = 0;

    for (const reminder of pendingReminders) {
      const user = await User.findById(reminder.userId);
      const task = await Task.findById(reminder.taskId);

      // Skip if task was completed or deleted
      if (!task || task.status === 'done' || !user) {
        await Reminder.findByIdAndUpdate(reminder._id, { status: 'failed' });
        continue;
      }

      if (reminder.type === 'email' && user.preferences?.reminderEmail !== false) {
        // Send email
        const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const taskUrl = `${appUrl}/tasks/${task._id}`;
        
        const success = await sendReminderEmail({
          to: user.email,
          taskTitle: task.title,
          dueDate: task.dueDate,
          priority: task.priority,
          url: taskUrl
        });

        if (success) {
          await Reminder.findByIdAndUpdate(reminder._id, { status: 'sent' });
          sentCount++;
        }
      } else {
        // If it's a push notification, handle web-push logic here
        // (Assuming web-push is implemented separately via Service Worker)
        await Reminder.findByIdAndUpdate(reminder._id, { status: 'sent' });
      }
    }

    return NextResponse.json({ message: 'Processed reminders', count: sentCount }, { status: 200 });

  } catch (error) {
    console.error('Cron reminder error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
