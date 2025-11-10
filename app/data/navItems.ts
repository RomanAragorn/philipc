import { Keyboard, Monitor, Mouse } from "lucide-react";

export const navItems = [
	{ id: "keyboard", label: "Keyboards", href: "/#", icon: Keyboard },
	{ id: "mouse", label: "Mouse", href: "/#", icon: Mouse },
	{ id: "monitor", label: "Monitors", href: "/#", icon: Monitor },
];

export const moreItems = [
	{ id: "ram", label: "RAM", href: "/#" },
	{ id: "ssd", label: "SSD", href: "/#" },
	{ id: "hardDrive", label: "Hard Drives", href: "/#" },
];

export interface NavItem {
	id: string;
	label: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
	current?: boolean;
}
