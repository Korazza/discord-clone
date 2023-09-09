"use client"

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

interface ActionTooltipProps {
	label: string
	side?: "top" | "right" | "bottom" | "left"
	align?: "start" | "center" | "end"
}

export const ActionTooltip: React.FC<
	React.PropsWithChildren<ActionTooltipProps>
> = ({ children, label, side, align }) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent side={side} align={align}>
					<p className="font-semibold text-sm">{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
