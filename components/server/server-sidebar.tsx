import { redirect } from "next/navigation"
import { ChannelType, MemberRole } from "@prisma/client"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ServerHeader } from "./server-header"
import { ServerSearch } from "./server-search"
import { ServerSection } from "./server-section"
import { ServerChannel } from "./server-channel"
import { ServerMember } from "./server-member"

interface ServerSidebarProps {
	serverId: string
}

const iconMap: Map<ChannelType, React.ReactNode> = new Map([
	[ChannelType.TEXT, <Hash key="text-channel" className="mr-2 w-5 h-5" />],
	[ChannelType.AUDIO, <Mic key="text-channel" className="mr-2 w-5 h-5" />],
	[ChannelType.VIDEO, <Video key="text-channel" className="mr-2 w-5 h-5" />],
])

const roleIconMap: Map<MemberRole, React.ReactNode | null> = new Map([
	[MemberRole.GUEST, null],
	[
		MemberRole.MODERATOR,
		<ShieldCheck
			key="moderator-icon"
			className="w-5 h-5 text-indigo-500 mr-2"
		/>,
	],
	[
		MemberRole.ADMIN,
		<ShieldAlert key="admin-icon" className="w-5 h-5 text-rose-500 mr-2" />,
	],
])

export const ServerSidebar: React.FC<ServerSidebarProps> = async ({
	serverId,
}) => {
	const profile = await currentProfile()

	if (!profile) {
		redirect("/")
	}

	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: {
				orderBy: {
					createdAt: "asc",
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: "asc",
				},
			},
		},
	})

	if (!server) {
		redirect("/")
	}

	const textChannels = server.channels.filter(
		(channel) => channel.type === ChannelType.TEXT
	)

	const audioChannels = server.channels.filter(
		(channel) => channel.type === ChannelType.AUDIO
	)

	const videoChannels = server.channels.filter(
		(channel) => channel.type === ChannelType.VIDEO
	)

	const members = server.members.filter(
		(member) => member.profileId !== profile.id
	)

	const role = server.members.find(
		(member) => member.profileId === profile.id
	)?.role

	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
			<ServerHeader server={server} role={role} />
			<ScrollArea className="flex-1">
				<div className="mt-2 px-3">
					<ServerSearch
						data={[
							{
								label: "Text channels",
								type: "channel",
								data: textChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap.get(channel.type),
								})),
							},
							{
								label: "Voice channels",
								type: "channel",
								data: audioChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap.get(channel.type),
								})),
							},
							{
								label: "Video channels",
								type: "channel",
								data: videoChannels?.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap.get(channel.type),
								})),
							},
							{
								label: "Members",
								type: "member",
								data: members?.map((member) => ({
									id: member.id,
									name: member.profile.name,
									icon: roleIconMap.get(member.role),
								})),
							},
						]}
					/>
				</div>
				<Separator className="h-[2px] bg-neutral-200 dark:bg-neutral-800 rounded-md my-2" />
				{!!textChannels?.length && (
					<div className="mb-2 px-3">
						<ServerSection
							sectionType="channels"
							channelType={ChannelType.TEXT}
							role={role}
							label="Text channels"
						/>
						<div className="space-y-[2px]">
							{textChannels.map((channel) => (
								<ServerChannel
									key={channel.id}
									channel={channel}
									role={role}
									server={server}
								/>
							))}
						</div>
					</div>
				)}
				{!!audioChannels?.length && (
					<div className="mb-2 px-3">
						<ServerSection
							sectionType="channels"
							channelType={ChannelType.AUDIO}
							role={role}
							label="Voice channels"
						/>
						<div className="space-y-[2px]">
							{audioChannels.map((channel) => (
								<ServerChannel
									key={channel.id}
									channel={channel}
									role={role}
									server={server}
								/>
							))}
						</div>
					</div>
				)}
				{!!videoChannels?.length && (
					<div className="mb-2 px-3">
						<ServerSection
							sectionType="channels"
							channelType={ChannelType.VIDEO}
							role={role}
							label="Video channels"
						/>
						<div className="space-y-[2px]">
							{videoChannels.map((channel) => (
								<ServerChannel
									key={channel.id}
									channel={channel}
									role={role}
									server={server}
								/>
							))}
						</div>
					</div>
				)}
				{!!members?.length && (
					<div className="mb-2 px-3">
						<ServerSection
							sectionType="members"
							channelType={ChannelType.VIDEO}
							role={role}
							label="Members"
							server={server}
						/>
						<div className="space-y-[2px]">
							{members.map((member) => (
								<ServerMember key={member.id} member={member} server={server} />
							))}
						</div>
					</div>
				)}
			</ScrollArea>
		</div>
	)
}
