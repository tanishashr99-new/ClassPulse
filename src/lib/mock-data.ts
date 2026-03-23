export const mockStudents = [
  { id: "1", name: "Aarav Sharma", email: "aarav@campus.edu", avatar: "AS", attendance: 94, grade: "A", status: "active" as const, streak: 12 },
  { id: "2", name: "Priya Patel", email: "priya@campus.edu", avatar: "PP", attendance: 88, grade: "A-", status: "active" as const, streak: 8 },
  { id: "3", name: "Rahul Kumar", email: "rahul@campus.edu", avatar: "RK", attendance: 76, grade: "B+", status: "warning" as const, streak: 3 },
  { id: "4", name: "Sneha Gupta", email: "sneha@campus.edu", avatar: "SG", attendance: 92, grade: "A", status: "active" as const, streak: 15 },
  { id: "5", name: "Arjun Singh", email: "arjun@campus.edu", avatar: "AS", attendance: 65, grade: "C+", status: "danger" as const, streak: 1 },
  { id: "6", name: "Meera Reddy", email: "meera@campus.edu", avatar: "MR", attendance: 97, grade: "A+", status: "active" as const, streak: 22 },
  { id: "7", name: "Vikram Joshi", email: "vikram@campus.edu", avatar: "VJ", attendance: 81, grade: "B", status: "active" as const, streak: 5 },
  { id: "8", name: "Ananya Iyer", email: "ananya@campus.edu", avatar: "AI", attendance: 90, grade: "A-", status: "active" as const, streak: 10 },
];

export const mockClasses = [
  { id: "1", name: "Data Structures & Algorithms", code: "CS201", students: 45, schedule: "Mon, Wed, Fri 9:00 AM", color: "#3b82f6" },
  { id: "2", name: "Machine Learning", code: "CS401", students: 38, schedule: "Tue, Thu 10:30 AM", color: "#8b5cf6" },
  { id: "3", name: "Database Systems", code: "CS301", students: 42, schedule: "Mon, Wed 2:00 PM", color: "#10b981" },
  { id: "4", name: "Web Development", code: "CS202", students: 50, schedule: "Tue, Thu 3:30 PM", color: "#f59e0b" },
  { id: "5", name: "Computer Networks", code: "CS302", students: 35, schedule: "Fri 11:00 AM", color: "#ef4444" },
];

export const mockAttendanceData = [
  { date: "Mon", present: 42, absent: 3, late: 2 },
  { date: "Tue", present: 40, absent: 5, late: 1 },
  { date: "Wed", present: 44, absent: 1, late: 2 },
  { date: "Thu", present: 38, absent: 6, late: 3 },
  { date: "Fri", present: 43, absent: 2, late: 1 },
];

export const mockPerformanceData = [
  { subject: "DSA", score: 85, average: 72 },
  { subject: "ML", score: 92, average: 78 },
  { subject: "DBMS", score: 78, average: 70 },
  { subject: "Web Dev", score: 95, average: 80 },
  { subject: "Networks", score: 88, average: 75 },
];

export const mockAssignments = [
  { id: "1", title: "Binary Search Tree Implementation", subject: "DSA", dueDate: "2026-03-25", status: "pending" as const, submissions: 32, total: 45 },
  { id: "2", title: "Neural Network from Scratch", subject: "ML", dueDate: "2026-03-22", status: "overdue" as const, submissions: 28, total: 38 },
  { id: "3", title: "SQL Query Optimization", subject: "DBMS", dueDate: "2026-03-28", status: "pending" as const, submissions: 15, total: 42 },
  { id: "4", title: "React Portfolio Project", subject: "Web Dev", dueDate: "2026-03-30", status: "active" as const, submissions: 40, total: 50 },
  { id: "5", title: "TCP/IP Protocol Analysis", subject: "Networks", dueDate: "2026-03-20", status: "completed" as const, submissions: 35, total: 35 },
];

export const mockTests = [
  { id: "1", title: "Midterm: Data Structures", subject: "DSA", date: "2026-03-18", duration: 90, questions: 40, avgScore: 72, status: "completed" as const },
  { id: "2", title: "Quiz 3: Supervised Learning", subject: "ML", date: "2026-03-25", duration: 30, questions: 20, avgScore: 0, status: "upcoming" as const },
  { id: "3", title: "Lab Exam: SQL", subject: "DBMS", date: "2026-03-15", duration: 60, questions: 25, avgScore: 81, status: "completed" as const },
  { id: "4", title: "Final: React & Node.js", subject: "Web Dev", date: "2026-04-05", duration: 120, questions: 50, avgScore: 0, status: "upcoming" as const },
];

export const mockNotifications = [
  { id: "1", title: "Attendance Alert", message: "Arjun Singh's attendance dropped below 70%", type: "warning" as const, time: "2 min ago", read: false },
  { id: "2", title: "Assignment Submitted", message: "32 students submitted BST Implementation", type: "success" as const, time: "1 hour ago", read: false },
  { id: "3", title: "AI Insight", message: "Class performance improved by 8% this week", type: "info" as const, time: "3 hours ago", read: true },
  { id: "4", title: "Test Scheduled", message: "ML Quiz 3 scheduled for March 25", type: "info" as const, time: "5 hours ago", read: true },
  { id: "5", title: "Low Attendance", message: "3 students have attendance below 75%", type: "danger" as const, time: "1 day ago", read: true },
];

export const mockLeaderboard = [
  { rank: 1, name: "Meera Reddy", avatar: "MR", score: 975, badges: 8, streak: 22, change: "up" as const },
  { rank: 2, name: "Sneha Gupta", avatar: "SG", score: 940, badges: 7, streak: 15, change: "up" as const },
  { rank: 3, name: "Aarav Sharma", avatar: "AS", score: 920, badges: 6, streak: 12, change: "same" as const },
  { rank: 4, name: "Ananya Iyer", avatar: "AI", score: 895, badges: 5, streak: 10, change: "down" as const },
  { rank: 5, name: "Priya Patel", avatar: "PP", score: 870, badges: 5, streak: 8, change: "up" as const },
  { rank: 6, name: "Vikram Joshi", avatar: "VJ", score: 810, badges: 4, streak: 5, change: "down" as const },
  { rank: 7, name: "Rahul Kumar", avatar: "RK", score: 750, badges: 3, streak: 3, change: "down" as const },
  { rank: 8, name: "Arjun Singh", avatar: "AS", score: 680, badges: 2, streak: 1, change: "down" as const },
];

export const mockWeeklyAttendance = [
  { week: "Week 1", rate: 92 },
  { week: "Week 2", rate: 89 },
  { week: "Week 3", rate: 94 },
  { week: "Week 4", rate: 91 },
  { week: "Week 5", rate: 87 },
  { week: "Week 6", rate: 93 },
  { week: "Week 7", rate: 95 },
  { week: "Week 8", rate: 90 },
];

export const mockMonthlyPerformance = [
  { month: "Sep", avg: 72 },
  { month: "Oct", avg: 75 },
  { month: "Nov", avg: 78 },
  { month: "Dec", avg: 74 },
  { month: "Jan", avg: 80 },
  { month: "Feb", avg: 83 },
  { month: "Mar", avg: 85 },
];

export const mockActivityFeed = [
  { id: "1", action: "submitted assignment", user: "Aarav Sharma", target: "BST Implementation", time: "5 min ago", icon: "file" as const },
  { id: "2", action: "completed test", user: "Priya Patel", target: "Midterm: DSA", time: "20 min ago", icon: "check" as const },
  { id: "3", action: "joined class", user: "New Student", target: "Machine Learning", time: "1 hour ago", icon: "plus" as const },
  { id: "4", action: "achieved badge", user: "Meera Reddy", target: "Perfect Attendance", time: "2 hours ago", icon: "award" as const },
  { id: "5", action: "posted announcement", user: "Prof. Verma", target: "Web Dev", time: "3 hours ago", icon: "message" as const },
];

export const mockAIInsights = [
  { id: "1", title: "Attendance Trend", insight: "Class attendance has improved by 8% over the last 3 weeks. Keep up the positive trend!", type: "positive" as const, metric: "+8%" },
  { id: "2", title: "At-Risk Students", insight: "3 students have attendance below 75%. Consider reaching out to Arjun Singh, who has the lowest attendance at 65%.", type: "warning" as const, metric: "3" },
  { id: "3", title: "Performance Prediction", insight: "Based on current trends, the class average is predicted to reach 87% by end of semester.", type: "positive" as const, metric: "87%" },
  { id: "4", title: "Assignment Completion", insight: "Neural Network assignment has a 12% lower submission rate than average. Consider extending the deadline.", type: "negative" as const, metric: "-12%" },
];

export const mockBadges = [
  { id: "1", name: "Perfect Week", description: "100% attendance for a week", icon: "🏆", earned: true },
  { id: "2", name: "Knowledge Seeker", description: "Complete 10 assignments", icon: "📚", earned: true },
  { id: "3", name: "Fast Learner", description: "Score 90%+ on 3 tests", icon: "⚡", earned: true },
  { id: "4", name: "Consistency King", description: "15-day attendance streak", icon: "🔥", earned: false },
  { id: "5", name: "Top Performer", description: "Rank #1 in leaderboard", icon: "👑", earned: false },
  { id: "6", name: "Early Bird", description: "Submit 5 assignments early", icon: "🌅", earned: true },
];

export const mockCalendarEvents = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const statuses = ["present", "absent", "late", "holiday", "none"] as const;
  const weekday = new Date(2026, 2, day).getDay();
  if (weekday === 0 || weekday === 6) return { day, status: "holiday" as const };
  if (day > 21) return { day, status: "none" as const };
  const rand = Math.random();
  if (rand > 0.9) return { day, status: "absent" as const };
  if (rand > 0.8) return { day, status: "late" as const };
  return { day, status: "present" as const };
});
