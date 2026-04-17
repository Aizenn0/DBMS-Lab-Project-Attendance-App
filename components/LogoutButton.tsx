'use client';
import { signOut, useSession } from "next-auth/react";

export function LogoutButton() {
  const { data: session } = useSession();
  
  if (!session) return null;

  return (
    <div className="flex items-center gap-4 ml-auto">
      <span className="text-sm text-gray-600">Logged in as {session.user?.name}</span>
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })} 
        className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded transition"
      >
        Sign Out
      </button>
    </div>
  );
}
