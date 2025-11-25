import { HeroSection } from "../ui/feature-carousel";

export default function TryScenarioSection() {
    const scenarios = [
        {
            src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
            alt: 'Database troubleshooting scenario'
        },
        {
            src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
            alt: 'API performance scenario'
        },
        {
            src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
            alt: 'Security vulnerability scenario'
        },
        {
            src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
            alt: 'Performance optimization scenario'
        },
        {
            src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
            alt: 'Infrastructure monitoring scenario'
        }
    ];

    const title = (
        <>
            Try a <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Scenario</span>
        </>
    );

    return (
        <section className="py-20">
            <HeroSection
                heading={title}
                subtitle="Experience our interactive troubleshooting environment with real-world application challenges"
                images={scenarios}
                className="min-h-[80vh] py-20"
            />
        </section>
    );
}
