'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <div className="text-red-500 bg-red-100 p-2 mb-4 rounded text-sm text-center">{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="border p-2 rounded"
            value={email} onChange={e => setEmail(e.target.value)} required />
          <input 
            type="password" 
            placeholder="Password" 
            className="border p-2 rounded"
            value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
