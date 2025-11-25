"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Settings, CreditCard, FileText, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { logout } from "@/app/actions/auth/action";
import type { User as UserType } from "@/components/app-sidebar";

interface MenuItem {
    label: string;
    value?: string;
    href: string;
    icon: React.ReactNode;
    external?: boolean;
}

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    user: UserType;
}

export default function ProfileDropdown({
    user,
    className,
    ...props
}: ProfileDropdownProps) {
    const { isMobile } = useSidebar();

    // Get user initials for fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const menuItems: MenuItem[] = [
        {
            label: "Profile",
            href: "/dashboard/user/profile",
            icon: <User className="w-4 h-4" />,
        },
        {
            label: "Settings",
            href: "/dashboard/user/settings",
            icon: <Settings className="w-4 h-4" />,
        },
        {
            label: "Billing",
            href: "/dashboard/user/billing",
            icon: <CreditCard className="w-4 h-4" />,
        },
        {
            label: "Terms & Policies",
            href: "/terms",
            icon: <FileText className="w-4 h-4" />,
            external: true,
        },
    ];

    return (
        <div className={cn("relative group/profile", className)} {...props}>
            <DropdownMenu>
                <div className="relative">
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white-50/80 dark:hover:bg-white-800/40 hover:shadow-sm transition-all duration-200 focus:outline-none w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
                        >
                            <div className="text-left flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight truncate">
                                    {user.name}
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 tracking-tight leading-tight truncate">
                                    {user.email}
                                </div>
                            </div>
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900 flex items-center justify-center">
                                        {user.avatar && user.avatar !== '/avatars/default.jpg' ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={36}
                                                height={36}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                                                {getInitials(user.name)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 transition-all duration-200 opacity-60 group-hover/profile:opacity-100 group-data-[state=open]/profile:opacity-100 group-data-[collapsible=icon]:hidden">
                        <svg
                            width="12"
                            height="24"
                            viewBox="0 0 12 24"
                            fill="none"
                            className="transition-all duration-200 text-zinc-400 dark:text-zinc-500 group-hover/profile:text-zinc-600 dark:group-hover/profile:text-zinc-300 group-data-[state=open]/profile:text-blue-500 dark:group-data-[state=open]/profile:text-blue-400 group-data-[state=open]/profile:scale-110"
                            aria-hidden="true"
                        >
                            <path
                                d="M2 4C6 8 6 16 2 20"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                    </div>

                    <DropdownMenuContent
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                        className="w-64 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/20
                    data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-top-right"
                    >
                        <div className="mb-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5 flex-shrink-0">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900 flex items-center justify-center">
                                        {user.avatar && user.avatar !== '/avatars/default.jpg' ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={36}
                                                height={36}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                                                {getInitials(user.name)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight truncate">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 tracking-tight leading-tight truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link
                                        href={item.href}
                                        className="flex items-center p-3 hover:bg-white-100/80 dark:hover:bg-white-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            {item.icon}
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight whitespace-nowrap group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                                                {item.label}
                                            </span>
                                        </div>
                                        <div className="flex-shrink-0 ml-auto">
                                            {item.value && (
                                                <span
                                                    className={cn(
                                                        "text-xs font-medium rounded-md py-1 px-2 tracking-tight",
                                                        item.label === "Model"
                                                            ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 border border-blue-500/10"
                                                            : "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10 border border-purple-500/10"
                                                    )}
                                                >
                                                    {item.value}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>

                        <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

                        <DropdownMenuItem asChild>
                            <button
                                type="button"
                                onClick={async () => {
                                    await logout();
                                }}
                                className="w-full flex items-center gap-3 p-3 duration-200 bg-red-500/10 rounded-xl hover:bg-red-500/20 cursor-pointer border border-transparent hover:border-red-500/30 hover:shadow-sm transition-all group"
                            >
                                <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                                <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                                    Sign Out
                                </span>
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    );
}

