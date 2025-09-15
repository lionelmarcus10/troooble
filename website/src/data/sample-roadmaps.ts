import { RoadmapClientType } from '@/utils/types'

export const sampleRoadmaps: RoadmapClientType[] = [
  {
    id: "1",
    slug: "frontend-fundamentals",
    title: "Frontend Fundamentals",
    description: "Master the basics of modern web development",
    icon: "Code",
    modules: 8,
    topics: [
      { id: 1, content: "HTML5 semantic elements and structure", roadmapId: "1" },
      { id: 2, content: "CSS3 flexbox and grid layouts", roadmapId: "1" },
      { id: 3, content: "JavaScript ES6+ features", roadmapId: "1" },
      { id: 4, content: "Responsive design principles", roadmapId: "1" },
      { id: 5, content: "Browser developer tools", roadmapId: "1" },
    ]
  },
  {
    id: "2",
    slug: "react-mastery",
    title: "React Mastery",
    description: "Build powerful user interfaces with React",
    icon: "Atom",
    modules: 12,
    topics: [
      { id: 6, content: "Component architecture and props", roadmapId: "2" },
      { id: 7, content: "State management with hooks", roadmapId: "2" },
      { id: 8, content: "Context API and global state", roadmapId: "2" },
      { id: 9, content: "React Router for navigation", roadmapId: "2" },
      { id: 10, content: "Performance optimization techniques", roadmapId: "2" },
    ]
  },
  {
    id: "3",
    slug: "backend-development",
    title: "Backend Development",
    description: "Server-side programming and API design",
    icon: "Server",
    modules: 10,
    topics: [
      { id: 11, content: "RESTful API design principles", roadmapId: "3" },
      { id: 12, content: "Database design and SQL", roadmapId: "3" },
      { id: 13, content: "Authentication and authorization", roadmapId: "3" },
      { id: 14, content: "Node.js and Express framework", roadmapId: "3" },
      { id: 15, content: "Error handling and logging", roadmapId: "3" },
    ]
  },
  {
    id: "4",
    slug: "devops-essentials",
    title: "DevOps Essentials",
    description: "Deploy and maintain applications at scale",
    icon: "Cloud",
    modules: 6,
    topics: [
      { id: 16, content: "Docker containerization", roadmapId: "4" },
      { id: 17, content: "CI/CD pipeline setup", roadmapId: "4" },
      { id: 18, content: "Cloud platform deployment", roadmapId: "4" },
      { id: 19, content: "Monitoring and alerting", roadmapId: "4" },
      { id: 20, content: "Infrastructure as code", roadmapId: "4" },
    ]
  },
  {
    id: "5",
    slug: "mobile-development",
    title: "Mobile Development",
    description: "Create native and cross-platform mobile apps",
    icon: "Smartphone",
    modules: 9,
    topics: [
      { id: 21, content: "React Native fundamentals", roadmapId: "5" },
      { id: 22, content: "Native device APIs", roadmapId: "5" },
      { id: 23, content: "State management in mobile", roadmapId: "5" },
      { id: 24, content: "Mobile UI/UX best practices", roadmapId: "5" },
      { id: 25, content: "App store deployment", roadmapId: "5" },
    ]
  },
  {
    id: "6",
    slug: "data-science",
    title: "Data Science",
    description: "Analyze data and build machine learning models",
    icon: "BarChart",
    modules: 11,
    topics: [
      { id: 26, content: "Python for data analysis", roadmapId: "6" },
      { id: 27, content: "Data visualization with charts", roadmapId: "6" },
      { id: 28, content: "Statistical analysis methods", roadmapId: "6" },
      { id: 29, content: "Machine learning algorithms", roadmapId: "6" },
      { id: 30, content: "Model evaluation and deployment", roadmapId: "6" },
    ]
  },
  {
    id: "7",
    slug: "cybersecurity",
    title: "Cybersecurity",
    description: "Protect systems and secure applications",
    icon: "Shield",
    modules: 7,
    topics: [
      { id: 31, content: "Security threat assessment", roadmapId: "7" },
      { id: 32, content: "Encryption and cryptography", roadmapId: "7" },
      { id: 33, content: "Network security protocols", roadmapId: "7" },
      { id: 34, content: "Penetration testing basics", roadmapId: "7" },
      { id: 35, content: "Incident response procedures", roadmapId: "7" },
    ]
  },
  {
    id: "8",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    description: "Design beautiful and user-friendly interfaces",
    icon: "Palette",
    modules: 8,
    topics: [
      { id: 36, content: "Design thinking methodology", roadmapId: "8" },
      { id: 37, content: "User research and personas", roadmapId: "8" },
      { id: 38, content: "Wireframing and prototyping", roadmapId: "8" },
      { id: 39, content: "Visual design principles", roadmapId: "8" },
      { id: 40, content: "Usability testing methods", roadmapId: "8" },
    ]
  }
]
