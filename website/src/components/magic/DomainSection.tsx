"use client";
import { motion } from "framer-motion";
import { Database, Clock, Zap, Server, Lock } from "lucide-react";
import { Stat, AnimatedHikeCard } from "../ui/HikeCard";

export default function DomainsSection() {
    const domains = [
        {
            title: "Database Issues",
            images: [
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1493421419110-74f4e85ba126?w=800&h=600&fit=crop"
            ],
            stats: [
                { icon: <Database className="h-4 w-4" />, label: "25 Scenarios" },
                { icon: <Clock className="h-4 w-4" />, label: "2-6 Hours" },
                { icon: <Zap className="h-4 w-4" />, label: "Beginner to Expert" }
            ] as Stat[],
            description: "Master database connection pools, query optimization, deadlock resolution, and performance tuning through real production scenarios.",
            href: "#database-challenges"
        },
        {
            title: "API Performance",
            images: [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop"
            ],
            stats: [
                { icon: <Server className="h-4 w-4" />, label: "30 Scenarios" },
                { icon: <Clock className="h-4 w-4" />, label: "1-4 Hours" },
                { icon: <Zap className="h-4 w-4" />, label: "Intermediate" }
            ] as Stat[],
            description: "Debug slow APIs, memory leaks, scaling issues, and load balancing problems in distributed systems and microservices.",
            href: "#api-challenges"
        },
        {
            title: "Security Vulnerabilities",
            images: [
                "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop"
            ],
            stats: [
                { icon: <Lock className="h-4 w-4" />, label: "20 Scenarios" },
                { icon: <Clock className="h-4 w-4" />, label: "3-8 Hours" },
                { icon: <Zap className="h-4 w-4" />, label: "Advanced" }
            ] as Stat[],
            description: "Identify and fix SQL injection, XSS, authentication bypass, and other critical security vulnerabilities in web applications.",
            href: "#security-challenges"
        }
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Domains We Cover
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Practice troubleshooting across the most critical areas of modern application development.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {domains.map((domain, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <AnimatedHikeCard {...domain} />
                            </motion.div>
                        ))}
                    </div>
                    
                </div>
            </div>
        </section>
    );
}
