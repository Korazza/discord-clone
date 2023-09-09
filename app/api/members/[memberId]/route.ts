import { NextResponse } from "next/server"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function PATCH(
	req: Request,
	{ params }: { params: { memberId: string } }
) {
	try {
		const profile = await currentProfile()

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const { searchParams } = new URL(req.url)
		const { role } = await req.json()
		const serverId = searchParams.get("serverId")

		if (!serverId) {
			return new NextResponse("Server ID missing", { status: 400 })
		}

		if (!params.memberId) {
			return new NextResponse("Member ID missing", { status: 400 })
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					update: {
						where: {
							id: params.memberId,
							profileId: {
								not: profile.id,
							},
						},
						data: {
							role,
						},
					},
				},
			},
			include: {
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

		return NextResponse.json(server)
	} catch (error) {
		console.log("[MEMBER ID PATCH]", error)
		return new NextResponse("Internal error", { status: 500 })
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { memberId: string } }
) {
	try {
		const profile = await currentProfile()

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get("serverId")

		if (!serverId) {
			return new NextResponse("Server ID missing", { status: 400 })
		}

		if (!params.memberId) {
			return new NextResponse("Member ID missing", { status: 400 })
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					deleteMany: {
						id: params.memberId,
						profileId: {
							not: profile.id,
						},
					},
				},
			},
			include: {
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

		return NextResponse.json(server)
	} catch (error) {
		console.log("[MEMBER ID DELETE]", error)
		return new NextResponse("Internal error", { status: 500 })
	}
}
