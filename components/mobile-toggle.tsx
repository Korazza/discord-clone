import { PanelLeftOpen } from "lucide-react"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar"
import { ServerSidebar } from "@/components/server/server-sidebar"

interface MobileToggleProps {
	serverId: string
}

export const MobileToggle: React.FC<MobileToggleProps> = ({ serverId }) => {
	return (
		<Sheet>
			<SheetTrigger>
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden w-6 h-6 mr-2 animate-pulse"
					asChild
				>
					<PanelLeftOpen />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0 flex gap-0">
				<div className="w-[72px]">
					<NavigationSidebar />
				</div>
				<ServerSidebar serverId={serverId} />
			</SheetContent>
		</Sheet>
	)
}
