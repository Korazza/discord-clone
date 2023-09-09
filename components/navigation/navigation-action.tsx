"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { ActionTooltip } from "@/components/action-tooltip"
import { useModal } from "@/hooks/use-modal-store"

export const NavigationAction = () => {
	const { onOpen } = useModal()
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	return (
		<div>
			<ActionTooltip side="right" align="center" label="Add a server">
				<button
					className="group flex items-center"
					onClick={() => onOpen("createServer")}
				>
					<div className="flex mx-3 w-[48px] h-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
						<Plus
							className="group-hover:text-white transition text-emerald-500"
							size={25}
						/>
					</div>
				</button>
			</ActionTooltip>
		</div>
	)
}
