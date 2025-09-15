import { ChallengeCardItem, Label } from "@/components/ui/search-bar"

export const sampleLabels: Label[] = [
  { id: 1, name: "Bug", color: "#ef4444" },
  { id: 2, name: "Feature", color: "#10b981" },
  { id: 3, name: "Enhancement", color: "#f59e0b" },
  { id: 4, name: "Documentation", color: "#3b82f6" },
  { id: 5, name: "Help Wanted", color: "#8b5cf6" },
  { id: 6, name: "Good First Issue", color: "#06b6d4" },
  { id: 7, name: "Priority High", color: "#dc2626" },
  { id: 8, name: "Priority Low", color: "#64748b" },
]

export const sampleProducts: ChallengeCardItem[] = [
  {
    id: 1,
    title: "Fix authentication flow redirect",
    description: "The authentication flow is not properly redirecting users after successful login. This affects user experience and needs immediate attention.",
    labels: ["Bug", "Priority High"],
    liked: false
  },
  {
    id: 2,
    title: "Add dark mode toggle",
    description: "Implement a dark mode toggle feature for better user experience during night time usage.",
    labels: ["Feature", "Enhancement"],
    liked: true
  },
  {
    id: 3,
    title: "Update API documentation",
    description: "The current API documentation is outdated and missing several new endpoints that were recently added.",
    labels: ["Documentation", "Priority Low"],
    liked: false
  },
  {
    id: 4,
    title: "Optimize database queries",
    description: "Several database queries are running slowly and need optimization to improve overall application performance.",
    labels: ["Enhancement", "Priority High"],
    liked: false
  },
  {
    id: 5,
    title: "Add user profile pictures",
    description: "Allow users to upload and display profile pictures in their account settings and throughout the application.",
    labels: ["Feature", "Help Wanted"],
    liked: true
  },
  {
    id: 6,
    title: "Fix mobile responsive layout",
    description: "The mobile layout has some responsive issues on smaller screens that need to be addressed.",
    labels: ["Bug", "Good First Issue"],
    liked: false
  },
  {
    id: 7,
    title: "Implement search functionality",
    description: "Add a comprehensive search feature that allows users to find content quickly and efficiently.",
    labels: ["Feature", "Priority High"],
    liked: false
  },
  {
    id: 8,
    title: "Add unit tests for components",
    description: "Increase test coverage by adding comprehensive unit tests for all React components.",
    labels: ["Enhancement", "Good First Issue"],
    liked: true
  },
  {
    id: 9,
    title: "Fix memory leak in dashboard",
    description: "There's a memory leak occurring in the dashboard component that causes performance degradation over time.",
    labels: ["Bug", "Priority High"],
    liked: false
  },
  {
    id: 10,
    title: "Add email notifications",
    description: "Implement email notification system for important events and user activities.",
    labels: ["Feature", "Help Wanted"],
    liked: false
  },
  {
    id: 11,
    title: "Improve loading states",
    description: "Add better loading indicators and skeleton screens throughout the application for improved UX.",
    labels: ["Enhancement", "Good First Issue"],
    liked: true
  },
  {
    id: 12,
    title: "Fix form validation errors",
    description: "Several forms have validation issues that allow invalid data to be submitted.",
    labels: ["Bug", "Priority High"],
    liked: false
  },
  {
    id: 13,
    title: "Add export functionality",
    description: "Allow users to export their data in various formats (PDF, CSV, Excel).",
    labels: ["Feature", "Priority Low"],
    liked: false
  },
  {
    id: 14,
    title: "Update dependencies",
    description: "Update all project dependencies to their latest stable versions for security and performance.",
    labels: ["Enhancement", "Priority Low"],
    liked: true
  },
  {
    id: 15,
    title: "Add keyboard shortcuts",
    description: "Implement useful keyboard shortcuts for power users to navigate the application more efficiently.",
    labels: ["Feature", "Enhancement"],
    liked: false
  }
]
