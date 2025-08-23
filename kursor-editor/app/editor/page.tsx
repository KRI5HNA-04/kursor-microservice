"use client";

import Navbar from "@/app/Components/Navbar";
import CodeEditor from "@/app/Components/EditorWithRunner";

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      <main className="p-4 mt-8">
        <CodeEditor />
      </main>
    </div>
  );
}
