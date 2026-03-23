"use client";

import React, { use } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Sparkles, Navigation } from "lucide-react";

export default function TestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // Assume id non-pending acts as completed for UI showcase
  const isCompleted = id !== "pending";

  return (
    <>
      <TopBar title={isCompleted ? "Test Score Breakdown" : "Test Preparations"} subtitle="Deep dive into learning outcomes and recommendations" />
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
           <div className="flex items-center gap-4 mb-8 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center \${isCompleted ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                 {isCompleted ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <Lock className="w-8 h-8 text-orange-500" />}
              </div>
              <div>
                 <h1 className="text-2xl font-bold">{isCompleted ? "Advanced Cloud Architecture" : "Midterm: System Design"}</h1>
                 <p className="text-[var(--text-secondary)]">{isCompleted ? "Completed on March 20, 2026 - Score: 92%" : "Upcoming Exam: March 25, 2026"}</p>
              </div>
           </div>

           {isCompleted ? (
             <div className="space-y-6">
                <div>
                   <h2 className="text-xl font-bold mb-2">Knowledge Gaps Identified:</h2>
                   <ul className="list-disc pl-5 space-y-2 text-[var(--text-secondary)] leading-relaxed">
                      <li>You missed 2 questions on Load Balancing Algorithms.</li>
                      <li>You answered 1 AWS S3 query incorrectly.</li>
                   </ul>
                </div>
                <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                   <h3 className="font-bold text-green-500 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Strong Competency Match</h3>
                   <p className="text-sm">You have mastered EC2 and Serverless Architecture. No immediate revision needed there!</p>
                </div>
             </div>
           ) : (
             <div className="space-y-6">
                <div>
                   <h2 className="text-xl font-bold mb-2 text-orange-500">Core focuses before you start:</h2>
                   <ul className="list-disc pl-5 space-y-2 text-[var(--text-secondary)] leading-relaxed">
                      <li>CAP Theorem constraints and definitions.</li>
                      <li>Horizontal versus Vertical Scaling scenarios.</li>
                      <li>Microservices inter-communication caching (Redis/Memcached).</li>
                   </ul>
                </div>
                <div>
                   <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Navigation className="w-5 h-5 text-blue-500" /> AI Recommendation:</h3>
                   <p className="text-[var(--text-secondary)]">Please re-read module 5 and run 2 simulated mock tests inside the Test Sandbox before officially clicking START.</p>
                </div>
                <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                   <h3 className="font-bold text-blue-500 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Prediction</h3>
                   <p className="text-sm">Based on your recent assignments, the AI predicts an 86% passing probability if you take the test right now.</p>
                </div>
             </div>
           )}
        </motion.div>
      </div>
    </>
  );
}
