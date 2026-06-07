import { redirect } from 'next/navigation';

export default function RootPage() {
  // Directly redirect to the dashboard. 
  // If the user isn't authenticated, the middleware will catch this and bounce them to /login automatically.
  // If they are authenticated, they go straight into the app.
  redirect('/dashboard');
}
