"use client";
import { motion } from "framer-motion";
import { Target, Code, Shield, Zap } from "lucide-react";
import { CardItem } from "../ui/cards";

const featuresData: CardItem[] = [
    {
        id: 1,
        title: 'Real-World Scenarios',
        subtitle: 'Challenges',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    },
    {
        id: 2,
        title: 'Interactive Labs',
        subtitle: 'Hands-On',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    },
    {
        id: 3,
        title: 'Skill Tracking',
        subtitle: 'Progress',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    },
    {
        id: 4,
        title: 'Expert Guidance',
        subtitle: 'Mentorship',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    },
];

export default function FeaturesSection() {
    const features = [
        {
            icon: <Target className="h-8 w-8 text-primary" />,
            title: "Realistic Scenarios",
            description: "Practice with challenges based on real production incidents and common application issues."
        },
        {
            icon: <Code className="h-8 w-8 text-primary" />,
            title: "Interactive Labs",
            description: "Hands-on environments where you can debug, test, and solve problems in real-time."
        },
        {
            icon: <Shield className="h-8 w-8 text-primary" />,
            title: "Progressive Learning",
            description: "Start with basics and advance to complex enterprise-level troubleshooting challenges."
        },
        {
            icon: <Zap className="h-8 w-8 text-primary" />,
            title: "Instant Feedback",
            description: "Get immediate validation and detailed explanations for your troubleshooting approach."
        }
    ];

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why TroubleshootLab?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        The modern way to master application troubleshooting skills
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}