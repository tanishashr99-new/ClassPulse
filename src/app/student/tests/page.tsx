"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { mockTests } from "@/lib/mock-data";
import { Clock, Play, CheckCircle2, BarChart3, FileQuestion, Calendar, Timer } from "lucide-react";

export default function StudentTestsPage() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const mockQuestions = [
    {
      q: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1,
    },
    {
      q: "Which data structure uses LIFO?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1,
    },
    {
      q: "Which sorting algorithm has the best average case?",
      options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"],
      correct: 1,
    },
    {
      q: "What is a complete binary tree?",
      options: [
        "All leaves at same level",
        "Every node has 2 children",
        "All levels filled except possibly last",
        "Height is log(n)",
      ],
      correct: 2,
    },
    {
      q: "DFS uses which data structure internally?",
      options: ["Queue", "Stack", "Heap", "Hash Table"],
      correct: 1,
    },
  ];

  useEffect(() => {
    if (!activeTest) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTest]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (activeTest) {
    return (
      <>
        <div
          className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-30"
          style={{
            background: "var(--bg-glass)",
            backdropFilter: "blur(20px)",
            borderColor: "var(--border-color)",
          }}
        >
          <div>
            <h1 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Quiz: Data Structures
            </h1>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Question {currentQ + 1} of {mockQuestions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                timeLeft < 300 ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
              }`}
            >
              <Timer className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => setActiveTest(null)}
              className="btn-primary py-2 px-4 text-xs"
            >
              Submit Test
            </button>
          </div>
        </div>

        <div className="p-6 max-w-3xl mx-auto">
          {/* Question indicators */}
          <div className="flex items-center gap-2 mb-8">
            {mockQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                  i === currentQ
                    ? "bg-blue-500 text-white"
                    : answers[i] !== undefined
                    ? "bg-green-500/10 text-green-500 border border-green-500/30"
                    : ""
                }`}
                style={
                  i !== currentQ && answers[i] === undefined
                    ? { background: "var(--bg-tertiary)", color: "var(--text-secondary)" }
                    : undefined
                }
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-8"
          >
            <p className="text-xs font-semibold text-blue-500 mb-2">
              Question {currentQ + 1}
            </p>
            <h2 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              {mockQuestions[currentQ].q}
            </h2>
            <div className="space-y-3">
              {mockQuestions[currentQ].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentQ]: i }))}
                  className={`w-full p-4 rounded-xl text-left text-sm font-medium border transition-all ${
                    answers[currentQ] === i
                      ? "border-blue-500 bg-blue-500/10 text-blue-500"
                      : "hover:bg-[var(--bg-secondary)]"
                  }`}
                  style={
                    answers[currentQ] !== i
                      ? { borderColor: "var(--border-color)", color: "var(--text-primary)" }
                      : undefined
                  }
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg mr-3 text-xs font-bold"
                    style={{
                      background: answers[currentQ] === i ? "rgba(59,130,246,0.2)" : "var(--bg-tertiary)",
                      color: answers[currentQ] === i ? "#3b82f6" : "var(--text-secondary)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                className="btn-secondary py-2 px-6 text-sm"
                disabled={currentQ === 0}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentQ(Math.min(mockQuestions.length - 1, currentQ + 1))}
                className="btn-primary py-2 px-6 text-sm"
              >
                {currentQ === mockQuestions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Tests" subtitle="Your assessments and results" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTests.map((test, i) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`badge ${test.status === "completed" ? "badge-success" : "badge-primary"}`}>
                    {test.status === "completed" ? "Completed" : "Upcoming"}
                  </span>
                  <h3 className="text-base font-bold mt-2" style={{ color: "var(--text-primary)" }}>
                    {test.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                    {test.subject}
                  </p>
                </div>
                {test.status === "completed" && (
                  <div className="text-right">
                    <p className="text-3xl font-bold gradient-text">
                      {test.avgScore + Math.floor(Math.random() * 10)}%
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Your Score</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                  <Calendar className="w-3.5 h-3.5" /> {test.date}
                </div>
                <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                  <Clock className="w-3.5 h-3.5" /> {test.duration} min
                </div>
                <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                  <FileQuestion className="w-3.5 h-3.5" /> {test.questions} Qs
                </div>
              </div>

              <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                {test.status === "upcoming" ? (
                  <button
                    onClick={() => setActiveTest(test.id)}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
                  >
                    <Play className="w-4 h-4" /> Start Test
                  </button>
                ) : (
                  <button className="w-full btn-secondary flex items-center justify-center gap-2 py-2.5 text-sm">
                    <BarChart3 className="w-4 h-4" /> View Score Breakdown
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
