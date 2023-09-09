import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
	src?: string
	className?: string
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, className }) => {
	return (
		<Avatar className={cn("w-7 h-7 md:w-10 md:h-10", className)}>
			<AvatarImage src={src} />
		</Avatar>
	)
}
