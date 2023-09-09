"use client"

import { useState } from "react"
import qs from "query-string"
import axios from "axios"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store"

export const DeleteMessageModal = () => {
	const { isOpen, onClose, type, data } = useModal()

	const isModalOpen = isOpen && type === "deleteMessage"
	const { apiUrl, query } = data

	const [isLoading, setIsLoading] = useState(false)

	const handleLeave = async () => {
		try {
			setIsLoading(true)

			const url = qs.stringifyUrl({
				url: apiUrl || "",
				query,
			})

			await axios.delete(url)

			onClose()
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Delete message
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure? This message will be permanently deleted!
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isLoading} variant="ghost" onClick={onClose}>
							Cancel
						</Button>
						<Button
							disabled={isLoading}
							variant="destructive"
							onClick={handleLeave}
						>
							Delete
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
