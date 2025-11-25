"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { ExpandableCard } from "../ui/expandable-card";

export default function TroubleshootingSection() {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: i * 0.2,
                ease: [0.25, 0.4, 0.25, 1] as const,
            },
        }),
    };

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2 
                            custom={0}
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold mb-4"
                        >
                            Master Real Challenges
                        </motion.h2>
                        <motion.p 
                            custom={1}
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-lg text-muted-foreground max-w-2xl mx-auto"
                        >
                            Practice with scenarios based on actual production incidents
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <motion.div
                            custom={2}
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <ExpandableCard
                                title="Database Connection Pool Exhausted"
                                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop"
                                description="Critical Production Issue"
                                classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-semibold [&_h4]:text-lg [&_h4]:mb-2"
                            >
                                <h4>The Scenario</h4>
                                <p>
                                    Your e-commerce API is returning 500 errors during peak traffic. Users can't complete purchases, 
                                    and the support team is overwhelmed with complaints. Database connection pool is exhausted, 
                                    but you need to identify the root cause quickly.
                                </p>
                                <h4>Troubleshooting Steps</h4>
                                <p>
                                    1. Check application logs for connection errors<br/>
                                    2. Analyze database connection pool metrics<br/>
                                    3. Identify long-running queries blocking connections<br/>
                                    4. Implement connection pool tuning and query optimization
                                </p>
                                <h4>Skills You'll Learn</h4>
                                <p>
                                    • Database performance monitoring<br/>
                                    • Connection pool management<br/>
                                    • Query optimization techniques<br/>
                                    • Load testing and capacity planning
                                </p>
                                <h4>Difficulty Level</h4>
                                <p className="italic border-l-4 border-primary pl-4">
                                    <strong>Intermediate</strong> - Requires understanding of database concepts, 
                                    application architecture, and performance monitoring tools.
                                </p>
                            </ExpandableCard>
                        </motion.div>

                        <motion.div
                            custom={3}
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <ExpandableCard
                                title="Memory Leak Investigation"
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                                description="Performance Degradation"
                                classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-semibold [&_h4]:text-lg [&_h4]:mb-2"
                            >
                                <h4>The Scenario</h4>
                                <p>
                                    Your Node.js application starts fast but gradually slows down over time. Memory usage keeps 
                                    increasing until the server crashes. Users are experiencing timeouts, and the application 
                                    requires frequent restarts. You need to find and fix the memory leak.
                                </p>
                                <h4>Investigation Process</h4>
                                <p>
                                    1. Monitor memory usage patterns and heap snapshots<br/>
                                    2. Use profiling tools to identify memory allocation<br/>
                                    3. Analyze code for common memory leak patterns<br/>
                                    4. Implement fixes and validate with load testing
                                </p>
                                <h4>Skills You'll Learn</h4>
                                <p>
                                    • Memory profiling and heap analysis<br/>
                                    • JavaScript/Node.js memory management<br/>
                                    • Performance monitoring tools<br/>
                                    • Load testing and capacity planning
                                </p>
                                <h4>Difficulty Level</h4>
                                <p className="italic border-l-4 border-primary pl-4">
                                    <strong>Advanced</strong> - Requires deep understanding of memory management, 
                                    profiling tools, and application performance optimization.
                                </p>
                            </ExpandableCard>
                        </motion.div>
                    </div>

                    <motion.div 
                        custom={4}
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mt-40"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground/80 tracking-wide">
                                Ready to Level Up Your Skills ?
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Start Your Troubleshooting Journey
                        </h3>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of developers mastering real-world troubleshooting skills.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="px-8 py-3 text-base">
                                Try Free Challenge
                            </Button>
                            <Button size="lg" variant="outline" className="px-8 py-3 text-base">
                                View All Scenarios
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}