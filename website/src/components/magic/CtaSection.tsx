"use client";
import { motion } from "framer-motion";
import { Mail, SendHorizonal } from "lucide-react";
import { Button } from "../ui/button";

export default function CtaSection() {
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
        <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2 
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        Ready to become a troubleshooting expert?
                    </motion.h2>
                    
                    <motion.p 
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
                    >
                        Join thousands of developers who have mastered application debugging with TroubleshootLab.
                    </motion.p>
                    
                    <motion.div 
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-md mx-auto"
                    >
                        <div className="bg-background rounded-2xl border p-2 shadow-lg">
                            <div className="relative grid grid-cols-[1fr_auto] items-center">
                                <Mail className="absolute left-4 my-auto h-5 w-5 text-muted-foreground pointer-events-none" />
                                <input
                                    placeholder="Enter your email address"
                                    className="h-12 w-full bg-transparent pl-12 pr-4 focus:outline-none"
                                    type="email"
                                />
                                <Button size="lg" className="mr-1">
                                    <span className="hidden sm:block">Start Learning</span>
                                    <SendHorizonal className="h-5 w-5 sm:hidden" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            Start with free challenges. No credit card required.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}