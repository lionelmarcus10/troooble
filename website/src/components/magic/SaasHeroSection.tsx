"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Menu, Target, X } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme-mode-toggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ElegantShapeProps {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: ElegantShapeProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

interface AnimatedGroupProps {
    children: React.ReactNode;
    className?: string;
    variants?: {
        container?: any;
        item?: any;
    };
}

function AnimatedGroup({ children, className, variants }: AnimatedGroupProps) {
    const defaultContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const defaultItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const containerVariants = variants?.container || defaultContainerVariants;
    const itemVariants = variants?.item || defaultItemVariants;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={cn(className)}
        >
            {Array.isArray(children) ? children.map((child, index) => (
                <motion.div key={index} variants={itemVariants}>
                    {child}
                </motion.div>
            )) : (
                <motion.div variants={itemVariants}>
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Challenges', href: '#challenges' },
    { name: 'Pricing', href: '#pricing' },
];

function HeroHeader() {
    const [menuState, setMenuState] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <nav
                data-state={menuState && 'active'}
                className="group w-full px-2"
            >
                <div className={cn(
                    'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
                    isScrolled ? 'bg-background/80 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5 shadow-lg' : 'bg-transparent'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <a
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2"
                            >
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                    <Target className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-bold">TroubleshootLab</span>
                            </a>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                            >
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150"
                                        >
                                            <span>{item.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150"
                                            >
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-4 sm:space-y-0 md:w-fit">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}
                                    asChild
                                >
                                    <a href="/auth">
                                        <span>Get started</span>
                                    </a>
                                </Button>
                                <Button
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}
                                    asChild
                                >
                                    <a href="/auth">
                                        <span>Get Started</span>
                                    </a>
                                </Button>
                                <ModeToggle />  
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}


export default function SaasHeroSection() {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1] as const,
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            <HeroHeader />
            
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03] blur-3xl" />

            {/* Animated shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-primary/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-secondary/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-accent/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-primary/[0.2]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 pt-20">
                <div className="max-w-4xl mx-auto text-center">
                    <AnimatedGroup>
                        <motion.div
                            custom={0}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 md:mb-12"
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground/80 tracking-wide">
                                Professional Troubleshooting Platform
                            </span>
                        </motion.div>

                        <motion.div
                            custom={1}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
                                    Master Application
                                </span>
                                <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-secondary">
                                    Troubleshooting
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            custom={2}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
                                Sharpen your debugging skills with real-world application challenges. 
                                From database issues to performance bottlenecks, become a troubleshooting expert.
                            </p>
                        </motion.div>

                        <motion.div
                            custom={3}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                        >
                            <Button size="lg" className="px-8 py-3 text-base" asChild>
                                <a href="#signup" className="flex items-center gap-2">
                                    Start Learning
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="px-8 py-3 text-base" asChild>
                                <a href="#demo" className="flex items-center gap-2">
                                    <Play className="h-4 w-4" />
                                    Try Demo
                                </a>
                            </Button>
                        </motion.div>

                        <motion.div
                            custom={4}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="relative max-w-5xl mx-auto"
                        >
                            <div className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-2 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-2xl" />
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center"
                                    alt="SaaS Dashboard"
                                    className="w-full h-auto rounded-xl shadow-lg"
                                    width="1200"
                                    height="800"
                                />
                            </div>
                        </motion.div>
                    </AnimatedGroup>
                </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
        </div>
    );
}
