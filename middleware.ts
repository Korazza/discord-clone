import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
	debug: process.env.NODE_ENV !== "production",
	publicRoutes: ["/api/uploadthing"],
})

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
