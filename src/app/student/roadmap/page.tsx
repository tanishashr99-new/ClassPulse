"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { CheckCircle2, Circle, Lock, ArrowDown } from "lucide-react";

export default function RoadmapPage() {
  const steps = [
    { title: "Foundations of AI", desc: "Understand basic ML terminology", status: "completed" },
    { title: "Data Preprocessing", desc: "Learn Pandas, Numpy, and Data Cleaning", status: "completed" },
    { title: "Supervised Learning", desc: "Linear Regression, Random Forests, SVMs", status: "active" },
    { title: "Deep Learning", desc: "Neural Networks, CNNs, RNNs", status: "locked" },
    { title: "Capstone Deployment", desc: "Deploy your model to Vercel/AWS", status: "locked" },
  ];

  return (
    <>
      <TopBar title="Learning Roadmap" subtitle="Sequential guide tailored to your major and past performance" />
      <div className="p-8 max-w-3xl mx-auto space-y-8 min-h-[calc(100vh-4rem)] relative">
        <div className="absolute top-12 bottom-12 left-[3.25rem] w-1 border-l border-dashed border-gray-300 dark:border-gray-700 z-0"></div>
        {steps.map((step, i) => {
           const isCompleted = step.status === "completed";
           const isActive = step.status === "active";
           return (
             <motion.div
               key={i}
               initial={{ opacity: 0, x: -25 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.15 }}
               className="flex items-start gap-8 z-10 relative"
             >
               <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 \${isCompleted ? 'bg-green-500 shadow-lg shadow-green-500/20' : isActive ? 'bg-blue-500 shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/20' : 'bg-[var(--bg-tertiary)] border border-[var(--border-color)]'}`}>
                 {isCompleted ? <CheckCircle2 className="w-6 h-6 text-white" /> : isActive ? <Circle className="w-6 h-6 text-white animate-pulse" fill="white" /> : <Lock className="w-5 h-5 text-gray-400" />}
               </div>
               
               <div className={`flex-1 p-6 rounded-2xl border \${isActive ? 'bg-[rgba(59,130,246,0.02)] border-blue-500/30' : 'bg-[var(--bg-card)] border-[var(--border-color)]'}`}>
                 <h3 className={`text-lg font-bold \${isActive ? 'text-blue-500' : 'text-[var(--text-primary)]'}`}>{step.title}</h3>
                 <p className="mt-2 text-sm text-[var(--text-secondary)]">{step.desc}</p>
                 {isActive && (
                   <button className="mt-4 px-6 py-2 btn-primary text-sm flex items-center gap-2">
                     Resume Module <ArrowDown className="w-4 h-4 -rotate-90" />
                   </button>
                 )}
               </div>
             </motion.div>
           );
        })}
      </div>
    </>
  );
}
