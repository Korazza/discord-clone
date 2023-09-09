"use client"

import { MemberRole } from "@prisma/client"
import {
	ChevronDown,
	LogOut,
	PlusCircle,
	Settings,
	Trash,
	UserPlus,
	Users,
} from "lucide-react"

import { ServerWithMembersWithProfiles } from "@/types"
import { useModal } from "@/hooks/use-modal-store"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface ServerHeaderProps {
	server: ServerWithMembersWithProfiles
	role?: MemberRole
}

export const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
	const { onOpen } = useModal()

	const isAdmin = role === MemberRole.ADMIN
	const isModerator = isAdmin || role === MemberRole.MODERATOR

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none" asChild>
				<button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-[2px] hover:bg-zinc-700/10 dark:hover:bg-zing-700/50 transition">
					{server.name}
					<ChevronDown className="w-5 h-5 ml-auto" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
				{isModerator && (
					<DropdownMenuItem
						className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("invite", { server })}
					>
						Invite
						<UserPlus className="w-5 h-5 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						className="px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("editServer", { server })}
					>
						Server settings
						<Settings className="w-5 h-5 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						className="px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("members", { server })}
					>
						Manage members
						<Users className="w-5 h-5 ml-auto" />
					</DropdownMenuItem>
				)}
				{isModerator && (
					<DropdownMenuItem
						className="px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("createChannel")}
					>
						Create channel
						<PlusCircle className="w-5 h-5 ml-auto" />
					</DropdownMenuItem>
				)}
				{isModerator && <DropdownMenuSeparator />}
				{isAdmin && (
					<DropdownMenuItem
						className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("deleteServer", { server })}
					>
						Delete server
						<Trash className="w-5 h-5 ml-auto" />
					</DropdownMenuItem>
				)}
				{!isAdmin && (
					<DropdownMenuItem
						className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("leaveServer", { server })}
					>
						Leave server
						<LogOut className="w-5 h-5 ml-auto" />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
