"use client"

import { useEffect, useState } from "react"
import { ChannelType, MemberRole } from "@prisma/client"
import { Plus, Users } from "lucide-react"

import { ServerWithMembersWithProfiles } from "@/types"
import { useModal } from "@/hooks/use-modal-store"
import { ActionTooltip } from "@/components/action-tooltip"

interface ServerSectionProps {
	label: string
	role?: MemberRole
	sectionType: "channels" | "members"
	channelType?: ChannelType
	server?: ServerWithMembersWithProfiles
}

export const ServerSection: React.FC<ServerSectionProps> = ({
	label,
	role,
	sectionType,
	channelType,
	server,
}) => {
	const { onOpen } = useModal()
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	return (
		<div className="flex items-center justify-between py-2">
			<p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
				{label}
			</p>
			{role !== MemberRole.GUEST && sectionType == "channels" && (
				<ActionTooltip label="Create channel" side="top">
					<button
						className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
						onClick={() => onOpen("createChannel", { channelType })}
					>
						<Plus className="w-4 h-4" />
					</button>
				</ActionTooltip>
			)}
			{role === MemberRole.ADMIN && sectionType === "members" && (
				<ActionTooltip label="Manage members" side="top">
					<button
						className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
						onClick={() => onOpen("members", { server })}
					>
						<Users className="w-4 h-4" />
					</button>
				</ActionTooltip>
			)}
		</div>
	)
}
