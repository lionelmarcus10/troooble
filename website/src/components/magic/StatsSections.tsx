"use client";
import { motion } from "framer-motion";

export default function StatsSection() {
    const stats = [
        {
            number: "50,000+",
            label: "Developers Trained",
            description: "Learning troubleshooting skills"
        },
        {
            number: "500+",
            label: "Real-World Scenarios",
            description: "Production-grade challenges"
        },
        {
            number: "95%",
            label: "Success Rate",
            description: "Skill improvement guarantee"
        },
        {
            number: "24/7",
            label: "Lab Access",
            description: "Always available practice"
        }
    ];

    return (
        <section className="py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
                    >
                        TroubleshootLab in numbers
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg leading-8 text-muted-foreground"
                    >
                        Join thousands of developers who have mastered troubleshooting through our proven platform.
                    </motion.p>
                </div>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                                    <dt className="text-4xl font-bold text-primary mb-2">{stat.number}</dt>
                                    <dd className="text-base font-semibold leading-7">{stat.label}</dd>
                                    <dd className="text-sm text-muted-foreground mt-1">{stat.description}</dd>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
