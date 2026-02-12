import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Learning Assistant",
  description: "A smart learning companion for 2nd graders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>" />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 relative overflow-x-hidden">
        {/* Decorative Background Blobs */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl animate-blob -z-10 mix-blend-multiply filter opacity-70"></div>
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl animate-blob animation-delay-2000 -z-10 mix-blend-multiply filter opacity-70"></div>
        <div className="fixed bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-green-200/40 rounded-full blur-3xl animate-blob animation-delay-4000 -z-10 mix-blend-multiply filter opacity-70"></div>

        {children}
      </body>
    </html>
  );
}
