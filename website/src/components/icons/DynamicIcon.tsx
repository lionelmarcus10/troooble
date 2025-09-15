import * as LucideIcons from "lucide-react"
// Dynamic icon component that can render any Lucide icon by name
export default function DynamicIcon({ name }: { name: string }) {
    // Get the icon component from Lucide icons
    const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name]
    
    // Fallback to a default icon if the requested icon doesn't exist
    if (!IconComponent) {
      const FallbackIcon = LucideIcons.HelpCircle
      return <FallbackIcon className="h-5 w-5 text-primary" />
    }
    
    return <IconComponent className="h-5 w-5 text-primary" />
  }


