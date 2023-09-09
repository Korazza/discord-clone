"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import * as z from "zod"
import axios from "axios"
import qs from "query-string"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Member, MemberRole, Profile } from "@prisma/client"
import Image from "next/image"
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react"

import { useModal } from "@/hooks/use-modal-store"
import { UserAvatar } from "@/components/user-avatar"
import { ActionTooltip } from "@/components/action-tooltip"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatItemProps {
	id: string
	content: string
	member: Member & {
		profile: Profile
	}
	timestamp: string
	fileUrl: string | null
	deleted: boolean
	currentMember: Member
	isUpdated: boolean
	socketUrl: string
	socketQuery: Record<string, string>
}

const roleIconMap: Map<MemberRole, React.ReactNode | null> = new Map([
	[MemberRole.GUEST, null],
	[
		MemberRole.MODERATOR,
		<ShieldCheck
			key="moderator-icon"
			className="w-4 h-4 text-indigo-500 ml-2"
		/>,
	],
	[
		MemberRole.ADMIN,
		<ShieldAlert key="admin-icon" className="w-4 h-4 text-rose-500 ml-2" />,
	],
])

const formSchema = z.object({
	content: z.string().min(1),
})

type formType = z.infer<typeof formSchema>

export const ChatItem: React.FC<ChatItemProps> = ({
	id,
	content,
	member,
	timestamp,
	fileUrl,
	deleted,
	currentMember,
	isUpdated,
	socketUrl,
	socketQuery,
}) => {
	const [isEditing, setIsEditing] = useState(false)
	const { onOpen } = useModal()
	const router = useRouter()
	const params = useParams()

	const form = useForm<formType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content,
		},
	})

	const isLoading = form.formState.isSubmitting

	const handleMemberClick = () => {
		if (member.id === currentMember.id) {
			return
		}

		router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
	}

	const onSubmit = async (values: formType) => {
		try {
			const url = qs.stringifyUrl({
				url: `${socketUrl}/${id}`,
				query: socketQuery,
			})

			await axios.patch(url, values)

			form.reset()
			setIsEditing(false)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		const handleKeyDown = (event: any) => {
			if (event.key === "Escape" || event.keyCode === 27) {
				setIsEditing(false)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [])

	useEffect(() => {
		form.reset({
			content,
		})
	}, [content, form])

	const fileType = fileUrl?.split(".").pop()

	const isAdmin = currentMember.role === MemberRole.ADMIN
	const isModerator = currentMember.role === MemberRole.MODERATOR
	const isOwner = currentMember.id === member.id
	const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
	const canEditMessage = !deleted && isOwner && !fileUrl
	const isPdf = fileType === "pdf" && fileUrl
	const isImage = !isPdf && fileUrl

	return (
		<div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
			<div className="group flex gap-x-2 items-start w-full">
				<div
					className="cursor-pointer hover:drop-shadow-md transition"
					onClick={handleMemberClick}
				>
					<UserAvatar src={member.profile.imageUrl} />
				</div>
				<div className="flex flex-col w-full">
					<div className="flex items-center gap-x-2">
						<div className="flex items-center">
							<p
								className="font-semibold text-sm hover:underline cursor-pointer"
								onClick={handleMemberClick}
							>
								{member.profile.name}
							</p>
							<ActionTooltip
								label={
									member.role[0].toUpperCase() +
									member.role.slice(1).toLowerCase()
								}
							>
								{roleIconMap.get(member.role)}
							</ActionTooltip>
						</div>
						<span className="text-xs text-zinc-500 dark:text-zinc-400">
							{timestamp}
						</span>
					</div>
					{isImage && (
						<a
							href={fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="relative aspect-square rounded-md mt-2 overflow-hidden flex items-center w-48 h-48  drop-shadow-lg"
						>
							<Image
								src={fileUrl}
								alt={content}
								fill
								className="object-cover"
							/>
						</a>
					)}
					{isPdf && (
						<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
							<FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
							<a
								href={fileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
							>
								PDF file
							</a>
						</div>
					)}
					{!fileUrl && !isEditing && (
						<p
							className={cn(
								"text-sm text-zinc-600 dark:text-zinc-300",
								deleted &&
									"italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
							)}
						>
							{content}
							{isUpdated && !deleted && (
								<span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
									(edited)
								</span>
							)}
						</p>
					)}
					{!fileUrl && isEditing && (
						<Form {...form}>
							<form
								className="flex items-center w-full gap-x-2 pt-2"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormControl>
												<div className="relative w-full">
													<Input
														disabled={isLoading}
														className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
														placeholder="Edited message..."
														{...field}
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button disabled={isLoading} size="sm" variant="primary">
									Save
								</Button>
							</form>
							<span className="text-[10px] mt-1 text-zinc-400">
								Press <span className="uppercase font-semibold">esc</span> to
								cancel, <span className="uppercase font-semibold">enter</span>{" "}
								to save
							</span>
						</Form>
					)}
				</div>
			</div>
			{canDeleteMessage && (
				<div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
					{canEditMessage && (
						<ActionTooltip label="Edit">
							<Edit
								className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
								onClick={() => setIsEditing(true)}
							/>
						</ActionTooltip>
					)}
					<ActionTooltip label="Delete">
						<Trash
							className="cursor-pointer ml-auto w-4 h-4 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition"
							onClick={() =>
								onOpen("deleteMessage", {
									apiUrl: `${socketUrl}/${id}`,
									query: socketQuery,
								})
							}
						/>
					</ActionTooltip>
				</div>
			)}
		</div>
	)
}
