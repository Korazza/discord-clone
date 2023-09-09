"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ActionTooltip } from "@/components/action-tooltip"

interface NavigationItemProps {
	id: string
	imageUrl: string
	name: string
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
	id,
	imageUrl,
	name,
}) => {
	const [isMounted, setIsMounted] = useState(false)

	const params = useParams()
	const router = useRouter()

	const handleClick = () => {
		router.push(`/servers/${id}`)
	}

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	return (
		<ActionTooltip side="right" align="center" label={name}>
			<button
				onClick={handleClick}
				className="group relative flex items-center"
			>
				<div
					className={cn(
						"absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
						params?.serverId !== id && "group-hover:h-[20px]",
						params?.serverId === id ? "h-[36px]" : "h-[8px]"
					)}
				/>
				<div
					className={cn(
						"relative group flex mx-3 w-[48px] h-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
						params?.serverId === id &&
							"bg-primary/10 text-primary rounded-[16px]"
					)}
				>
					<Image fill src={imageUrl} alt="Server" />
				</div>
			</button>
		</ActionTooltip>
	)
}
