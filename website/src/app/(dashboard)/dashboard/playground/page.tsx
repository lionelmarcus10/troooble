"use client"
import { ChallengeCardSearchComponent, ChallengeSearchComponent, SearchComponent, SearchComponentLight } from "@/components/ui/search-bar"
import { sampleLabels, sampleProducts } from "@/data/sample-products"
import { ChevronRight } from "lucide-react"

// Sample data for the search component
const searchData = [
  {
    id: 1,
    creator: "John Doe",
    title: "AI-Powered Chatbot",
    description: "A chatbot that can answer common customer queries using natural language processing.",
    tags: ["AI", "Chatbot", "Customer Support"],
  },
  {
    id: 2,
    creator: "Jane Smith",
    title: "Smart Home Automation",
    description: "A system to control home appliances via a mobile app using IoT technology.",
    tags: ["IoT", "Smart Home", "Automation"],
  },
  {
    id: 3,
    creator: "Alice Johnson",
    title: "Eco-Friendly Delivery Service",
    description: "A sustainable delivery service using electric bikes to reduce carbon emissions.",
    tags: ["Sustainability", "Delivery", "Eco-Friendly"],
  },
  {
    id: 4,
    creator: "Michael Brown",
    title: "Blockchain-Based Voting System",
    description: "A secure and transparent online voting system using blockchain technology.",
    tags: ["Blockchain", "Security", "Voting"],
  },
  {
    id: 5,
    creator: "Emma Wilson",
    title: "AI-Powered Resume Screener",
    description: "An AI tool that screens resumes and ranks candidates based on job requirements.",
    tags: ["AI", "Recruitment", "HR Tech"],
  },
]
// Sample challenge data for the challenge search component
const challengeData = [
  {
    id: 1,
    title: "Build a Full-Stack E-commerce App",
    description:
      "Create a complete e-commerce platform with user authentication, product catalog, shopping cart, and payment integration using modern web technologies.",
    difficulty: "Hard" as const,
    category: "Web Development",
    participants: 1247,
    deadline: "Dec 15, 2024",
    prize: "$5,000",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
  },
  {
    id: 2,
    title: "AI Image Recognition Challenge",
    description:
      "Develop an AI model that can accurately classify and detect objects in images with at least 95% accuracy on the test dataset.",
    difficulty: "Hard" as const,
    category: "Machine Learning",
    participants: 892,
    deadline: "Jan 20, 2025",
    prize: "$3,500",
    tags: ["Python", "TensorFlow", "Computer Vision", "AI"],
  },
  {
    id: 3,
    title: "Mobile Weather App",
    description:
      "Design and build a beautiful, user-friendly weather application for mobile devices with location-based forecasts and interactive maps.",
    difficulty: "Medium" as const,
    category: "Mobile Development",
    participants: 634,
    deadline: "Nov 30, 2024",
    prize: "$2,000",
    tags: ["React Native", "API Integration", "UI/UX", "Maps"],
  },
  {
    id: 4,
    title: "CSS Animation Showcase",
    description:
      "Create stunning CSS animations and transitions that demonstrate advanced techniques without using JavaScript frameworks.",
    difficulty: "Easy" as const,
    category: "Frontend",
    participants: 1456,
    deadline: "Dec 5, 2024",
    prize: "$1,000",
    tags: ["CSS", "Animation", "Creative", "Frontend"],
  },
  {
    id: 5,
    title: "Blockchain Voting System",
    description:
      "Build a secure, transparent voting system using blockchain technology that ensures vote integrity and voter privacy.",
    difficulty: "Hard" as const,
    category: "Blockchain",
    participants: 423,
    deadline: "Feb 10, 2025",
    prize: "$4,000",
    tags: ["Solidity", "Web3", "Security", "Smart Contracts"],
  },
  {
    id: 6,
    title: "Real-time Chat Application",
    description:
      "Develop a scalable real-time messaging platform with features like group chats, file sharing, and message encryption.",
    difficulty: "Medium" as const,
    category: "Backend",
    participants: 789,
    deadline: "Jan 15, 2025",
    prize: "$2,500",
    tags: ["Socket.io", "Node.js", "Redis", "WebRTC"],
  },
]

export default function Page() {
  return (
    <div className="flex">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="flex-1 p-6">
            <div className="max-w-8xl h-full mx-auto">
                <ChallengeCardSearchComponent items={sampleProducts} labels={sampleLabels} />
              {/* <SearchComponentLight data={searchData} /> */}
                {/* <SearchComponent data={searchData} /> */}
              {/* <ChallengeSearchComponent challenges={challengeData} /> */}
            </div>
        </div>

      </div>
    </div>
  )
}
