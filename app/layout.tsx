import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attendance App",
  description: "Student-Teacher Attendance Application",
};

import { Providers } from "./providers";
import { LogoutButton } from "@/components/LogoutButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
        <Providers>
          <main className="max-w-4xl mx-auto p-4 md:p-8">
            <nav className="mb-8 flex items-center gap-4 text-blue-600 font-medium">
              <a href="/" className="hover:underline">Dashboard</a>
              <a href="/manage" className="hover:underline">Manage</a>
              <a href="/reports" className="hover:underline">Reports</a>
              <LogoutButton />
            </nav>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
