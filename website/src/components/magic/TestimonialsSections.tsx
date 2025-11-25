"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";


export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Senior Developer",
            company: "TechCorp",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b66f35bc?w=100&h=100&fit=crop&crop=face",
            content: "TroubleshootLab completely transformed how I approach debugging. The real-world scenarios are incredibly valuable and helped me solve production issues I never encountered before.",
            rating: 5
        },
        {
            name: "Marcus Rodriguez",
            role: "DevOps Engineer",
            company: "StartupX",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            content: "The interactive labs are amazing. I went from struggling with database performance issues to confidently optimizing queries in just a few weeks. Highly recommended!",
            rating: 5
        },
        {
            name: "Emily Johnson",
            role: "Full Stack Developer",
            company: "InnovateCo",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            content: "The progression from beginner to advanced scenarios is perfect. I love how each challenge builds on previous knowledge. The certificates really helped during my job interviews.",
            rating: 5
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
                        What developers say
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg leading-8 text-muted-foreground"
                    >
                        Real feedback from developers who have advanced their careers with TroubleshootLab.
                    </motion.p>
                </div>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative h-full rounded-3xl bg-background/50 backdrop-blur-sm border border-border/50 p-8 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                                <div className="flex items-center gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Sparkles key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                
                                <blockquote className="text-lg leading-relaxed text-foreground/90 mb-8">
                                    "{testimonial.content}"
                                </blockquote>
                                
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <img 
                                            src={testimonial.avatar} 
                                            alt={testimonial.name}
                                            className="relative w-12 h-12 rounded-full object-cover border-2 border-border/50"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        <p className="text-xs text-muted-foreground/70">{testimonial.company}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                <div className="mt-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button variant="outline" size="lg" className="group">
                            Read more reviews
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}