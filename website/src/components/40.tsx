import { TestimonialsWithMarquee } from "@/components/magic/testimonials-with-marquee"
import SaasHeroSection from "./magic/SaasHeroSection";
import HowItWorksSection from "./magic/HowItWorksSection";
import FeaturesSection from "./magic/FeaturesSection";
import TryScenarioSection from "./magic/TryScenarioSection";
import SecondaryCtaSection from "./magic/SecondaryCtaSection";
import DomainsSection from "./magic/DomainSection";
import TroubleshootingSection from "./magic/TroubleshootingSection";
import StatsSection from "./magic/StatsSections";
import CtaSection from "./magic/CtaSection";
import PricingSection from "./magic/PricingSection";




const testimonials = [
  {
    author: {
      name: "Emma Thompson",
      handle: "@emmaai",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
    href: "https://twitter.com/emmaai"
  },
  {
    author: {
      name: "David Park",
      handle: "@davidtech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
    href: "https://twitter.com/davidtech"
  },
  {
    author: {
      name: "Sofia Rodriguez",
      handle: "@sofiaml",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive."
  }
]


export default function Demo() {
    return (
        <>
            <SaasHeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TryScenarioSection />
            <DomainsSection />
            <SecondaryCtaSection />
            <StatsSection />
            <TroubleshootingSection />
            <PricingSection />
            <TestimonialsWithMarquee
                title="Trusted by developers worldwide"
                description="Join thousands of developers who are already building the future with our AI platform"
                testimonials={testimonials}
            />
            <CtaSection />

        </>
    );
}

