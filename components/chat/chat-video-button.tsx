"use client"

import qs from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Video, VideoOff } from "lucide-react"

import { ActionTooltip } from "@/components/action-tooltip"

export const ChatVideoButton = () => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const isVideo = searchParams?.get("video")
	const tooltipLabel = isVideo ? "End video call" : "Start video call"

	const Icon = isVideo ? VideoOff : Video

	const handleClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname || "",
				query: {
					video: isVideo ? undefined : true,
				},
			},
			{ skipNull: true }
		)

		router.push(url)
	}

	return (
		<ActionTooltip side="bottom" label={tooltipLabel}>
			<button
				onClick={handleClick}
				className="hover:opacity-75 transition mr-4 flex items-center"
			>
				<Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
			</button>
		</ActionTooltip>
	)
}
