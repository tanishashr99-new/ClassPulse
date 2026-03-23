"use client";

import React, { use } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Sparkles, Navigation } from "lucide-react";

export default function AssignmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // Let's pretend id 1 is "completed" and id 2 is "pending" for UI showcase.
  const isCompleted = id !== "pending";

  return (
    <>
      <TopBar title={isCompleted ? "Completed Task Analysis" : "Pending Task Outlook"} subtitle="Deep dive into learning outcomes and recommendations" />
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
           <div className="flex items-center gap-4 mb-8 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center \${isCompleted ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                 {isCompleted ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <Lock className="w-8 h-8 text-orange-500" />}
              </div>
              <div>
                 <h1 className="text-2xl font-bold">{isCompleted ? "Database Optimization" : "Advanced Graph Theory"}</h1>
                 <p className="text-[var(--text-secondary)]">{isCompleted ? "Completed on March 20, 2026" : "Pending Deadline: March 25, 2026"}</p>
              </div>
           </div>

           {isCompleted ? (
             <div className="space-y-6">
                <div>
                   <h2 className="text-xl font-bold mb-2">What you learned:</h2>
                   <ul className="list-disc pl-5 space-y-2 text-[var(--text-secondary)] leading-relaxed">
                      <li>You successfully learned complex B-Tree indexing.</li>
                      <li>You executed multi-join queries with 98% efficiency.</li>
                      <li>Query cost reduction strategies.</li>
                   </ul>
                </div>
                <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                   <h3 className="font-bold text-green-500 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Strong Competency Match</h3>
                   <p className="text-sm">You have mastered this topic and won't need immediate revision.</p>
                </div>
             </div>
           ) : (
             <div className="space-y-6">
                <div>
                   <h2 className="text-xl font-bold mb-2 text-orange-500">Topics you left behind:</h2>
                   <ul className="list-disc pl-5 space-y-2 text-[var(--text-secondary)] leading-relaxed">
                      <li>Dijkstra's Algorithm and shortest-path optimization.</li>
                      <li>A* Search Heuristics.</li>
                      <li>Directed Acyclic Graphs (DAGs) and Topological Sorting.</li>
                   </ul>
                </div>
                <div>
                   <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Navigation className="w-5 h-5 text-blue-500" /> How you can learn this:</h3>
                   <p className="text-[var(--text-secondary)]">Review lecture 14 module materials on the roadmap and attempt the practice sandbox exercises before starting this assignment.</p>
                </div>
                <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                   <h3 className="font-bold text-blue-500 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Recommendation</h3>
                   <p className="text-sm">We suggest dedicating 4.5 hours of focus time to this over the next 3 days.</p>
                </div>
             </div>
           )}
        </motion.div>
      </div>
    </>
  );
}
