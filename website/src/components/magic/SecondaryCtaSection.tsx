import { ArrowRight } from "lucide-react";

export default function SecondaryCtaSection() {
    return (
        <section className="w-full py-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-semibold">Advanced Learning Features</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Everything you need to master troubleshooting, track progress, and advance your career.
                </p>
            </div>

            <div className="flex flex-wrap items-start justify-center gap-10">
                <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
                    <img
                        className="rounded-xl"
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                        alt="Real-time feedback"
                    />
                    <h3 className="text-base font-semibold mt-4">Real-time Feedback</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get instant insights into your troubleshooting approach with detailed explanations and hints.
                    </p>
                </div>

                <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
                    <img
                        className="rounded-xl"
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                        alt="Progress tracking"
                    />
                    <h3 className="text-base font-semibold mt-4">Progress Tracking</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Monitor your skill development across domains with detailed analytics and achievements.
                    </p>
                </div>

                <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
                    <img
                        className="rounded-xl"
                        src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"
                        alt="Certification paths"
                    />
                    <h3 className="text-base font-semibold mt-4">Certification Paths</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Earn industry-recognized certificates to showcase your troubleshooting expertise.
                    </p>
                </div>
            </div>
            
            <div className="relative mx-auto max-w-5xl px-4 mt-16">
                <div className="absolute -z-50 size-[400px] -top-10 -left-20 aspect-square rounded-full bg-primary/20 blur-3xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-10">
                    <div className="md:col-span-2">
                        <img 
                            alt="TroubleshootLab dashboard showcase" 
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" 
                            className="rounded-xl shadow-lg"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <img 
                            alt="Interactive challenge interface" 
                            className="hover:-translate-y-0.5 transition duration-300 rounded-xl" 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" 
                        />
                        <h3 className="text-[24px]/7.5 font-medium mt-6">
                            Master troubleshooting with hands-on practice
                        </h3>
                        <p className="text-muted-foreground mt-2">
                            TroubleshootLab empowers you to build expertise through real-world scenarios and expert guidance.
                        </p>
                        <a href="#learn-more" className="group flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition">
                            Learn more about our methodology
                            <ArrowRight className="size-5 group-hover:translate-x-0.5 transition duration-300" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}