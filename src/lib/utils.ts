import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
    case "present":
    case "completed":
    case "submitted":
      return "badge-success";
    case "warning":
    case "late":
    case "pending":
      return "badge-warning";
    case "danger":
    case "absent":
    case "overdue":
      return "badge-danger";
    default:
      return "badge-primary";
  }
}

export function getAttendanceColor(percentage: number): string {
  if (percentage >= 90) return "#10b981";
  if (percentage >= 75) return "#f59e0b";
  return "#ef4444";
}

export function generateAvatarGradient(name: string): string {
  const colors = [
    ["#3b82f6", "#8b5cf6"],
    ["#8b5cf6", "#ec4899"],
    ["#10b981", "#3b82f6"],
    ["#f59e0b", "#ef4444"],
    ["#06b6d4", "#3b82f6"],
    ["#ec4899", "#f59e0b"],
  ];
  const index = name.charCodeAt(0) % colors.length;
  return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
}
