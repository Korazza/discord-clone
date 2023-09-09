import { redirect } from "next/navigation"
import { redirectToSignIn } from "@clerk/nextjs"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

interface ServerPageProps {
	params: {
		serverId: string
	}
}

const ServerPage: React.FC<ServerPageProps> = async ({ params }) => {
	const profile = await currentProfile()

	if (!profile) {
		return redirectToSignIn()
	}

	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: "general",
				},
			},
		},
	})

	const initialChannel = server?.channels[0]

	if (!initialChannel || initialChannel.name !== "general") {
		return null
	}

	return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`)
}

export default ServerPage
