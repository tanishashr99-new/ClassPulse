export const MOCK_STUDENTS = [
  { id: "24CSE001", name: "Arjun Singh", email: "arjun.singh@giet.edu", attendance: 87, avatar: "AS", rank: "#3" },
  { id: "24CSE338", name: "Khushi Sarkar", email: "khushi.sarkar@giet.edu", attendance: 91, avatar: "KS", rank: "#2" },
  { id: "24CSE060", name: "Ayush Kumar", email: "ayush.kumar@giet.edu", attendance: 78, avatar: "AK", rank: "#4" },
  { id: "24CSE045", name: "Tanisha Sharma", email: "tanisha.sharma@giet.edu", attendance: 95, avatar: "TS", rank: "#1" },
  { id: "24CSE022", name: "Rohan Mehta", email: "rohan.mehta@giet.edu", attendance: 82, avatar: "RM", rank: "#5" },
  { id: "24CSE071", name: "Priya Nair", email: "priya.nair@giet.edu", attendance: 69, avatar: "PN", rank: "#6" },
];

export const MOCK_CLASSES = [
  { id: "dsa-101", name: "Data Structures & Algorithms", code: "DSA", students: 42, schedule: "Mon/Wed/Fri 9AM", color: "#3b82f6" },
  { id: "ml-201", name: "Machine Learning Fundamentals", code: "ML", students: 38, schedule: "Tue/Thu 11AM", color: "#8b5cf6" },
  { id: "dbms-301", name: "Database Management Systems", code: "DBMS", students: 40, schedule: "Mon/Wed 2PM", color: "#10b981" },
];

export const MOCK_TESTS = [
  { id: "test-1", title: "ML Quiz 3", subject: "ML", date: "March 25, 2026", duration: "30 min", status: "Upcoming", students: 38 },
  { id: "test-2", title: "DSA Final Exam", subject: "DSA", date: "April 2, 2026", duration: "90 min", status: "Upcoming", students: 42 },
];

export const MOCK_ASSIGNMENTS = [
  { id: "asn-1", title: "BST Implementation", subject: "DSA", dueDate: "March 24, 2026", status: "Active", submissions: 28, total: 42 },
  { id: "asn-2", title: "SQL Joins Practice", subject: "DBMS", dueDate: "March 28, 2026", status: "Active", submissions: 15, total: 40 },
  { id: "asn-3", title: "Linear Regression", subject: "ML", dueDate: "April 1, 2026", status: "Pending", submissions: 0, total: 38 },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "Tanisha Sharma", score: 2840, badges: 6, streak: 14, attendance: 95, avatar: "TS" },
  { rank: 2, name: "Khushi Sarkar", score: 2650, badges: 5, streak: 11, attendance: 91, avatar: "KS" },
  { rank: 3, name: "Arjun Singh", score: 2410, badges: 4, streak: 8, attendance: 87, avatar: "AS" },
  { rank: 4, name: "Ayush Kumar", score: 2180, badges: 3, streak: 5, attendance: 78, avatar: "AK" },
  { rank: 5, name: "Rohan Mehta", score: 1950, badges: 3, streak: 3, attendance: 82, avatar: "RM" },
  { rank: 6, name: "Priya Nair", score: 1620, badges: 2, streak: 1, attendance: 69, avatar: "PN" },
];

export const MOCK_ATTENDANCE_STATS = {
  overall: 91,
  present: 38,
  late: 4,
  absent: 2,
};

export const MOCK_DAILY_ATTENDANCE = [
  { date: "Mon", present: 85, late: 10, absent: 5 },
  { date: "Tue", present: 88, late: 7, absent: 5 },
  { date: "Wed", present: 91, late: 5, absent: 4 },
  { date: "Thu", present: 84, late: 12, absent: 4 },
  { date: "Fri", present: 94, late: 4, absent: 2 },
];

export const MOCK_CALENDAR = [
  // March 2026 simulation
  // Mark Mon/Wed/Fri as present
  // 2 absences on March 3 (Tue) and March 10 (Tue)
  ...Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const date = new Date(2026, 2, day);
    const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ...
    
    let status: "present" | "absent" | "late" | "none" = "none";
    
    if (day === 3 || day === 10) {
      status = "absent";
    } else if ([1, 3, 5].includes(dayOfWeek)) {
      status = "present";
    } else if ([2, 4].includes(dayOfWeek)) {
       // Randomly some late marks for realism
       status = day % 7 === 0 ? "late" : "none";
    }
    
    return { day, status };
  })
];
